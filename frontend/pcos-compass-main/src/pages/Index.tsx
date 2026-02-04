import { useState, useRef } from "react";
import Header from "@/components/Header";
import PCOSForm from "@/components/PCOSForm";
import DiagnosticReport from "@/components/DiagnosticReport";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Info, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Demo report for preview purposes
const DEMO_REPORT = `
# PCOS Diagnostic Report

## Patient Information
- **Name:** Demo Patient
- **Assessment Date:** ${new Date().toLocaleDateString()}
- **Region:** Sample Region

---

## Diagnosis Summary

Based on the provided clinical data and laboratory values, this assessment evaluates the presence and characteristics of **Polycystic Ovary Syndrome (PCOS)**.

### Rotterdam Criteria Assessment

| Criterion | Status | Notes |
|-----------|--------|-------|
| Oligo/Anovulation | ✓ Present | Irregular menstrual cycles |
| Hyperandrogenism | ⚠ Borderline | Elevated testosterone levels |
| Polycystic Ovaries | ✓ Present | Based on ultrasound findings |

---

## Phenotype Classification

**Phenotype A (Classic PCOS)** - All three Rotterdam criteria are met.

### Key Findings:
- Menstrual irregularity with cycles longer than 35 days
- Biochemical hyperandrogenism detected
- Polycystic ovarian morphology on ultrasound

---

## Laboratory Analysis

### Hormonal Profile
- **Total Testosterone:** Elevated (above reference range)
- **SHBG:** Within normal limits
- **Free Androgen Index:** Calculated - borderline elevated

### Metabolic Assessment
- **Fasting Insulin:** Slightly elevated
- **Fasting Glucose:** Normal range
- **HOMA-IR:** Indicates mild insulin resistance
- **TSH:** Within normal limits (thyroid function normal)
- **Prolactin:** Normal (rules out hyperprolactinemia)

---

## Personalized Management Plan

### Lifestyle Modifications
1. **Dietary Changes**
   - Low glycemic index diet recommended
   - Reduce processed carbohydrates
   - Increase fiber intake

2. **Physical Activity**
   - 150 minutes of moderate exercise weekly
   - Combination of cardio and resistance training

3. **Weight Management**
   - Even 5-10% weight loss can improve symptoms
   - Regular monitoring recommended

### Follow-up Recommendations
- Repeat hormonal panel in 3 months
- Regular menstrual cycle tracking
- Annual metabolic screening
- Ultrasound reassessment in 6 months

---

*This report is generated for informational purposes and should be reviewed by a qualified healthcare provider.*
`;

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [patientName, setPatientName] = useState<string>("");
  const reportRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);

    const name = formData.get("patient_name") as string;
    setPatientName(name);

    try {
      // Convert FormData to JSON for API call
      const data: Record<string, any> = {};
      formData.forEach((value, key) => {
        if (value instanceof File) {
          // Handle file uploads separately if needed
          data[key] = value;
        } else {
          // Convert numeric strings to numbers
          const numValue = parseFloat(value as string);
          if (!isNaN(numValue) && key !== 'patient_name' && key !== 'region') {
            data[key] = numValue;
          } else {
            data[key] = value;
          }
        }
      });

      // Make API call to Django backend
      const response = await fetch('http://localhost:8000/pcos/api/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Set the report from the API response
      if (result.recommendation) {
        setReport(result.recommendation);
      } else {
        // Fallback to demo report if no recommendation
        setReport(DEMO_REPORT.replace("Demo Patient", name));
      }

      toast({
        title: "Analysis Complete",
        description: "Your PCOS diagnostic report has been generated.",
      });

      // Smooth scroll to report
      setTimeout(() => {
        reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);

    } catch (error) {
      console.error('API call failed:', error);
      toast({
        title: "Error",
        description: "Failed to connect to the server. Please ensure the Django backend is running.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Instructions Banner */}
        <Card className="mb-8 border-primary/20 bg-gradient-to-r from-primary/5 via-card to-accent/20">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="hidden sm:flex h-10 w-10 shrink-0 rounded-full bg-primary/10 items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary sm:hidden" />
                  AI-Powered PCOS Diagnostic Assessment
                </h2>
                <p className="text-sm text-muted-foreground">
                  Complete the form below with patient information, laboratory values, and ultrasound data. 
                  Our AI system will analyze the data and generate a comprehensive diagnostic report 
                  including phenotype classification and personalized management recommendations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Alert */}
        <div className="flex items-start gap-3 p-4 mb-8 rounded-lg bg-muted/50 border border-border">
          <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <strong className="text-foreground">Quick Tips:</strong> Navigate through the tabs to enter 
            Patient Info, Lab Values, and Ultrasound data. Ultrasound measurements are optional and can 
            be auto-calculated from the uploaded image.
          </div>
        </div>

        {/* Form Section */}
        <div className="max-w-4xl mx-auto">
          <PCOSForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        {/* Report Section */}
        {report && (
          <div ref={reportRef} className="max-w-4xl mx-auto mt-12 scroll-mt-8">
            <DiagnosticReport report={report} patientName={patientName} />
          </div>
        )}

        {/* Disclaimer */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Medical Disclaimer:</strong> This tool is intended for 
              clinical decision support only. All results should be reviewed and validated by a qualified 
              healthcare provider before making any diagnostic or treatment decisions.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-6 border-t border-border bg-card">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} PCOS-CDSS. For clinical use only.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
