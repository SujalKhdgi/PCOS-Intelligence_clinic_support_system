import json
import os
import google.generativeai as genai
from dotenv import load_dotenv

# 1. Load Environment Variables
load_dotenv() 

api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("CRITICAL WARNING: API Key is missing from .env file!")

# 2. CONFIGURE GEMINI
# Use 'rest' transport to avoid network blocking
genai.configure(
    api_key=api_key,
    transport='rest' 
)

class PCOSRecommendationEngine:
    def __init__(self, json_path="F:\project\PCOS\PCOS_Intelligence\Clinical_Daignose\pcos_protocols.json"):
        self.json_path = json_path
        self.rules = self._load_rules()
        
        # --- THE REGION FIX IS HERE ---
        # 'gemini-flash-latest' automatically finds the working model for your region (India)
        self.model = genai.GenerativeModel('gemini-flash-latest') 

    def _load_rules(self):
        try:
            with open(self.json_path, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return []

    def get_phenotype_rules(self, phenotype_id):
        for rule in self.rules:
            if rule["phenotype_id"] == phenotype_id:
                return rule
        return None

    def _call_gemini(self, prompt):
        print("   --> Sending request to AI...")
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"AI Error: {str(e)}"

    # ==========================================
    # 1. DIET PLAN GENERATOR
    # ==========================================
    def generate_diet_recommendation(self, phenotype_id, meal_type="Dinner", allergies="None"):
        rule_set = self.get_phenotype_rules(phenotype_id)
        if not rule_set: return "Error: Unknown Phenotype ID"
        
        diet = rule_set['dietary_principles']
        ingr = rule_set['ingredient_rules'] 
        
        prompt = f"""
        ACT AS: Expert Clinical Nutritionist for PCOS.
        PATIENT: {rule_set['name']}
        ALLERGIES: {allergies}
        
        TASK: Write a strictly compliant {meal_type} recipe.
        - Must use: {', '.join(ingr['allowed_and_prioritized'])}
        - Must avoid: {', '.join(ingr['forbidden_or_limit'])}
        
        OUTPUT: Recipe Name, Ingredients, Instructions, Medical Benefit.
        """
        return self._call_gemini(prompt)

    # ==========================================
    # 2. EXERCISE PLAN GENERATOR
    # ==========================================
    def generate_exercise_schedule(self, phenotype_id):
        rule_set = self.get_phenotype_rules(phenotype_id)
        if not rule_set: return "Error: Unknown Phenotype ID"
        
        ex = rule_set['exercise_rules']
        
        prompt = f"""
        ACT AS: PCOS Fitness Coach.
        PATIENT: {rule_set['name']}
        RULES: Focus on {ex['focus']}.
        
        TASK: Create a 1-Week Workout Schedule (Mon-Sun) with Rest Days.
        Keep it short (bullet points).
        """
        return self._call_gemini(prompt)

# ==========================================
# TEST RUN
# ==========================================
if __name__ == "__main__":
    engine = PCOSRecommendationEngine()
    test_phenotype = "inflammatory" 
    
    print(f"--- Contacting Gemini for {test_phenotype} PCOS... ---")
    
    print("\n[GEMINI DIET PLAN]")
    print(engine.generate_diet_recommendation(test_phenotype, "Breakfast"))

    print("\n[GEMINI WORKOUT PLAN]")
    print(engine.generate_exercise_schedule(test_phenotype))