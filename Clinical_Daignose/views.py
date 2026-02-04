from django.shortcuts import render
from .forms import PCOSInputForm
from .engine import PCOSDiagnosticEngine

def pcos_form_view(request):
    if request.method == "POST":
        form = PCOSInputForm(request.POST)
        if form.is_valid():
            data = form.cleaned_data
            engine = PCOSDiagnosticEngine(data)
            result = engine.run_diagnosis()
            return render(request, "Clinical_Daignose/result.html", {"result": result})
    else:
        form = PCOSInputForm()

    return render(request, "Clinical_Daignose/form.html", {"form": form})
