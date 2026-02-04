from .engine import PCOSDiagnosticEngine
from .rag_engine import PCOSRecommendationEngine
from .forms import PCOSInputForm
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import markdown


def pcos_form_view(request):
    if request.method == "POST":
        form = PCOSInputForm(request.POST)

        if form.is_valid():
            data = form.cleaned_data

            region = data.pop("region")
            patient_name = data.pop("patient_name", "Patient")

            diagnostic_engine = PCOSDiagnosticEngine(data)
            diagnosis_result = diagnostic_engine.run_diagnosis()

            # 🔹 Case 1: Review Needed
            if diagnosis_result.get("status") == "Review Needed":
                return render(
                    request,
                    "Clinical_Daignose/result.html",
                    {
                        "result": diagnosis_result,
                        "recommendation": None,
                        "region": region,
                        "patient_name": patient_name
                    }
                )

            recommendation_html = None

            # 🔹 Case 2: Diagnosis available
            if diagnosis_result.get("diagnosis"):
                phenotype_map = {
                    "Insulin-Resistant PCOS": "insulin_resistant",
                    "Inflammatory PCOS": "inflammatory",
                    "Hyperandrogenic PCOS": "hyperandrogenic",
                    "Post-Pill / Mild PCOS": "post_pill",
                    "Adrenal/Unspecified PCOS": "adrenal"
                }

                phenotype_id = phenotype_map.get(diagnosis_result.get("phenotype"))

                if phenotype_id:
                    rag = PCOSRecommendationEngine()

                    # Markdown text from RAG
                    recommendation_md = rag.generate_comprehensive_plan(
                        phenotype_id=phenotype_id,
                        region=region,
                        user_name=patient_name
                    )

                    # ✅ Convert Markdown → HTML
                    recommendation_html = markdown.markdown(
                        recommendation_md,
                        extensions=["extra", "tables"]
                    )

            return render(
                request,
                "Clinical_Daignose/result.html",
                {
                    "result": diagnosis_result,
                    "recommendation": recommendation_html,
                    "region": region,
                    "patient_name": patient_name
                }
            )

    else:
        form = PCOSInputForm()

    return render(
        request,
        "Clinical_Daignose/form.html",
        {"form": form}
    )


@api_view(['POST'])
def pcos_diagnosis_api(request):
    """
    API endpoint for PCOS diagnosis
    """
    try:
        data = request.data
        print("Received data:", data)  # Debug logging

        # Extract patient details
        region = data.get("region")
        patient_name = data.get("patient_name", "Patient")

        if not region:
            return Response(
                {"error": "Region is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Remove patient details from diagnostic data
        diagnostic_data = data.copy()
        diagnostic_data.pop("region", None)
        diagnostic_data.pop("patient_name", None)
        print("Diagnostic data after removing patient details:", diagnostic_data)  # Debug logging

        # Validate required fields and ensure they are valid numbers
        required_fields = [
            'cycle_length_days', 'cycles_per_year', 'total_testosterone',
            'shbg', 'fasting_insulin', 'fasting_glucose', 'tsh', 'prolactin',
            'crp', 'follicle_count_left', 'follicle_count_right',
            'ovarian_volume_left', 'ovarian_volume_right'
        ]

        missing_fields = []
        invalid_fields = []

        for field in required_fields:
            if field not in diagnostic_data:
                missing_fields.append(field)
            elif diagnostic_data[field] is None or diagnostic_data[field] == '':
                missing_fields.append(field)
            elif not isinstance(diagnostic_data[field], (int, float)) or diagnostic_data[field] < 0:
                invalid_fields.append(field)

        if missing_fields:
            return Response(
                {"error": f"Missing or empty required fields: {', '.join(missing_fields)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if invalid_fields:
            return Response(
                {"error": f"Invalid values for fields (must be positive numbers): {', '.join(invalid_fields)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Run diagnosis
        diagnostic_engine = PCOSDiagnosticEngine(diagnostic_data)
        diagnosis_result = diagnostic_engine.run_diagnosis()

        response_data = {
            "patient_name": patient_name,
            "region": region,
            "diagnosis": diagnosis_result
        }

        # Add recommendations if diagnosis is available
        if diagnosis_result.get("diagnosis"):
            phenotype_map = {
                "Insulin-Resistant PCOS": "insulin_resistant",
                "Inflammatory PCOS": "inflammatory",
                "Hyperandrogenic PCOS": "hyperandrogenic",
                "Post-Pill / Mild PCOS": "post_pill",
                "Adrenal/Unspecified PCOS": "adrenal"
            }

            phenotype_id = phenotype_map.get(diagnosis_result.get("phenotype"))

            if phenotype_id:
                try:
                    rag = PCOSRecommendationEngine()
                    recommendation_md = rag.generate_comprehensive_plan(
                        phenotype_id=phenotype_id,
                        region=region,
                        user_name=patient_name
                    )

                    # Convert Markdown to HTML
                    recommendation_html = markdown.markdown(
                        recommendation_md,
                        extensions=["extra", "tables"]
                    )

                    response_data["recommendation"] = recommendation_html
                except Exception as e:
                    # Fallback to demo report if AI fails
                    response_data["recommendation"] = get_demo_report(patient_name, region)
                    response_data["note"] = "AI diagnosis unavailable - showing demo report. Please configure GOOGLE_API_KEY for real AI analysis."

        return Response(response_data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"error": f"An error occurred: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
