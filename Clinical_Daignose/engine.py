class PCOSDiagnosticEngine:
    def __init__(self, data):
        """
        Input 'data' is a dictionary containing extracted values from
        OCR (Blood) and Computer Vision (Ultrasound).
        """
        self.data = data
        self.diagnosis_report = {
            "criteria_met": [],
            "diagnosis": False,
            "phenotype": "Unknown",
            "lifestyle_protocol": "Generic Healthy Living"
        }

    # --- 1. HELPER CALCULATORS ---
    def calculate_fai(self):
        """Calculates Free Androgen Index = (Total T / SHBG) * 100"""
        try:
            t = self.data.get('total_testosterone', 0)
            shbg = self.data.get('shbg', 1) # Avoid div by zero
            return (t / shbg) * 100
        except:
            return 0

    def calculate_homa_ir(self):
        """Calculates Insulin Resistance = (Insulin * Glucose) / 405"""
        try:
            ins = self.data.get('fasting_insulin', 0)
            glu = self.data.get('fasting_glucose', 0)
            return (ins * glu) / 405
        except:
            return 0

    # --- 2. ROTTERDAM CRITERIA CHECKS ---
    
    def check_irregular_periods(self):
        # Criterion A: Oligo-anovulation
        cycle_days = self.data.get('cycle_length_days', 28)
        cycles_per_year = self.data.get('cycles_per_year', 12)
        
        if cycle_days > 35 or cycle_days < 21 or cycles_per_year < 8:
            return True
        return False

    def check_hyperandrogenism(self):
        # Criterion B: High Male Hormones (Biochemical)
        t_level = self.data.get('total_testosterone', 0)
        fai = self.calculate_fai()
        
        # Thresholds: T > 45 ng/dL OR FAI > 5%
        if t_level > 45 or fai > 5.0:
            return True
        return False

    def check_polycystic_morphology(self):
        # Criterion C: Ultrasound findings (2023 Guidelines)
        # Note: Checks the worst ovary
        follicles = max(self.data.get('follicle_count_left', 0), self.data.get('follicle_count_right', 0))
        volume = max(self.data.get('ovarian_volume_left', 0), self.data.get('ovarian_volume_right', 0))
        
        # Thresholds: FNPO >= 20 OR Volume > 10ml
        if follicles >= 20 or volume > 10.0:
            return True
        return False

    # --- 3. SAFETY & EXCLUSION LOGIC ---
    def check_exclusions(self):
        alerts = []
        if self.data.get('tsh', 0) > 4.5:
            alerts.append("High TSH (Possible Hypothyroidism)")
        if self.data.get('prolactin', 0) > 25:
            alerts.append("High Prolactin (Hyperprolactinemia)")
        return alerts

    # --- 4. MAIN EXECUTION ---
    def run_diagnosis(self):
        # Step 1: Check Exclusion
        alerts = self.check_exclusions()
        if alerts:
            return {"status": "Review Needed", "alerts": alerts}

        # Step 2: Check 3 Criteria
        c1 = self.check_irregular_periods()
        c2 = self.check_hyperandrogenism()
        c3 = self.check_polycystic_morphology()
        
        criteria_list = []
        if c1: criteria_list.append("Oligo-anovulation (Irregular Cycles)")
        if c2: criteria_list.append("Hyperandrogenism (High Hormones)")
        if c3: criteria_list.append("Polycystic Morphology (Ultrasound)")

        # Rotterdam Rule: Must meet 2 out of 3
        is_pcos = len(criteria_list) >= 2
        
        self.diagnosis_report["diagnosis"] = is_pcos
        self.diagnosis_report["criteria_met"] = criteria_list

        if is_pcos:
            self.determine_phenotype()
        
        return self.diagnosis_report

    # --- 5. PHENOTYPING ENGINE (ROOT CAUSE) ---
    def determine_phenotype(self):
        homa = self.calculate_homa_ir()
        inflammation = self.data.get('crp', 0)
        androgens = self.check_hyperandrogenism()
        morphology = self.check_polycystic_morphology()

        # Logic Tree for Phenotypes
        if homa > 2.0:
            self.diagnosis_report["phenotype"] = "Insulin-Resistant PCOS"
            self.diagnosis_report["lifestyle_protocol"] = "Protocol A: Low-GI Diet + Inositol + Strength Training"
        
        elif inflammation > 3.0: # High CRP
             self.diagnosis_report["phenotype"] = "Inflammatory PCOS"
             self.diagnosis_report["lifestyle_protocol"] = "Protocol D: Gluten/Dairy Free + Anti-inflammatory Support"

        elif androgens and not homa > 2.0:
            self.diagnosis_report["phenotype"] = "Hyperandrogenic PCOS"
            self.diagnosis_report["lifestyle_protocol"] = "Protocol B: Spearmint Tea + Zinc + Stress Management"

        elif morphology and not androgens and not homa > 2.0:
            # Often caused by stopping birth control
            self.diagnosis_report["phenotype"] = "Post-Pill / Mild PCOS"
            self.diagnosis_report["lifestyle_protocol"] = "Protocol C: Nutrient Repletion (Mg, Zinc, B6)"
        
        else:
            self.diagnosis_report["phenotype"] = "Adrenal/Unspecified PCOS"
            self.diagnosis_report["lifestyle_protocol"] = "Protocol E: Sleep Hygiene + Cortisol Regulation (Yoga/Meditation)"

# ==========================================
# TEST RUN (What happens when a user uploads)
# ==========================================

# Simulating data extracted from PDF and Image
user_data = {
    # History
    "cycle_length_days": 50,      # Irregular
    "cycles_per_year": 5,         # Irregular
    
    # Blood (OCR Extracted)
    "total_testosterone": 30,     # High (Threshold > 45)
    "shbg": 45,
    "fasting_insulin": 8,        # High
    "fasting_glucose": 85,
    "tsh": 8.5,                   # Normal
    "prolactin": 15,              # Normal
    "crp": 1.2,                   # Normal
    
    # Ultrasound (AI Extracted)
    "follicle_count_left": 18,    # High (Threshold >= 20)
    "follicle_count_right": 15,
    "ovarian_volume_left": 8.5,  # High (Threshold > 10)
    "ovarian_volume_right": 7.0
}

# Run the Engine
engine = PCOSDiagnosticEngine(user_data)
result = engine.run_diagnosis()

# Print Results
import json
print(json.dumps(result, indent=4))