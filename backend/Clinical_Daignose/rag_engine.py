import os
import json
import google.generativeai as genai

from dotenv import load_dotenv

# --- DEBUGGING: FIND THE KEY ---

# Folder where THIS script is located
base_path = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(base_path, ".env")

print(f"🔍 Looking for .env file at: {env_path}")

# Check if .env exists
if os.path.exists(env_path):
    print("✅ File found! Loading variables...")
    load_dotenv(env_path)
else:
    print("❌ ERROR: .env file NOT found.")
    print("📂 Files actually in this folder:")
    for f in os.listdir(base_path):
        print("   -", f)

# Load API key
api_key = os.getenv("GOOGLE_API_KEY")
print("🔑 API Key Loaded:", "YES" if api_key else "NO")



# api_key = "PASTE_YOUR_KEY_HERE_DIRECTLY"

if api_key:
    genai.configure(api_key=api_key, transport='rest')

class PCOSRecommendationEngine:
    def __init__(self, json_filename="F:\project\PCOS\PCOS_Intelligence\Clinical_Daignose\pcos_protocols.json"):
        self.json_path = os.path.join(base_path, json_filename)
        self.rules = self._load_rules()
        self.model = genai.GenerativeModel('gemini-flash-latest') 

    def _load_rules(self):
        try:
            with open(self.json_path, 'r') as f:
                #print(f"✅ Rules loaded from: {json_filename}")
                return json.load(f)
        except FileNotFoundError:
            print(f"❌ ERROR: JSON not found at: {self.json_path}")
            return []

    def get_phenotype_rules(self, phenotype_id):
        for rule in self.rules:
            if rule["phenotype_id"] == phenotype_id:
                return rule
        return None

    def _call_gemini(self, prompt):
        print("   --> AI is generating report... (Please wait)")
        try:
            if not api_key: return "Error: API Key is missing."
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"AI Error: {str(e)}"

    def generate_comprehensive_plan(self, phenotype_id, region="India", user_name="User"):
            
            rule_set = self.get_phenotype_rules(phenotype_id)
            if not rule_set: 
                return f"Error: Phenotype ID '{phenotype_id}' not found."

            # Load Rules safely using .get(...) with parentheses
            goal = rule_set.get('clinical_goal', 'Health Improvement')
            focus = rule_set.get('dietary_focus', 'Balanced Diet')
            avoids = rule_set.get('lifestyle_avoids', [])
            
            # --- THIS WAS THE ERROR LINE ---
            supps = rule_set.get('supplement_rules', {}) 
            # -------------------------------

            prompt = f"""
            ACT AS: A Senior PCOS Specialist.
            PATIENT: {user_name} ({region}).
            DIAGNOSIS: {rule_set['name']}
            
            TASK: Write a Personalized Health Plan.
            
            1. **DIAGNOSIS EXPLAINED**
            - Explain {rule_set['name']} simply.

            2. **THE "RED LIST" (AVOID)**
            - Identify 5 common {region} foods she must STRICTLY AVOID.
            - Explain WHY.

            3. **THE "GREEN LIST" (EAT)**
            - Create a {region} Cuisine Meal Plan (Breakfast, Lunch, Dinner).
            - Focus: {focus}.

            4. **MOVEMENT PLAN**
            - 7-Day Workout Schedule.
            - Explain why.

            5. **SUPPLEMENT STACK**
            - Recommend: {', '.join(supps.get('core_stack', []))}
            - Benefit: {supps.get('specific_benefit', 'General Health')}

            6. **LIFESTYLE WARNINGS**
            - Warn about: {', '.join(avoids)}

            TONE: Empathetic, motivating.
            """
            
            return self._call_gemini(prompt)

if __name__ == "__main__":
    engine = PCOSRecommendationEngine()
    print(engine.generate_comprehensive_plan("insulin_resistant", "Pune, Maharashtra", "Prachi"))