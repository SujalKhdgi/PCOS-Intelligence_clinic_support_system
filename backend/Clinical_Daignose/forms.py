from django import forms

class PCOSInputForm(forms.Form):
    # ---- Patient Details ----
    patient_name = forms.CharField(
        max_length=100,
        required=False,
        label="Your Name"
    )

    region = forms.CharField(
        max_length=100,
        required=True,
        label="City / Region"
    )

    # ---- History ----
    cycle_length_days = forms.IntegerField(error_messages={'required': 'Please fill this required field'})
    cycles_per_year = forms.IntegerField(error_messages={'required': 'Please fill this required field'})

    # ---- Blood ----
    total_testosterone = forms.FloatField(error_messages={'required': 'Please fill this required field'})
    shbg = forms.FloatField(error_messages={'required': 'Please fill this required field'})
    fasting_insulin = forms.FloatField(error_messages={'required': 'Please fill this required field'})
    fasting_glucose = forms.FloatField(error_messages={'required': 'Please fill this required field'})
    tsh = forms.FloatField(error_messages={'required': 'Please fill this required field'})
    prolactin = forms.FloatField(error_messages={'required': 'Please fill this required field'})
    crp = forms.FloatField(error_messages={'required': 'Please fill this required field'})

    # ---- Ultrasound ----
    follicle_count_left = forms.IntegerField(error_messages={'required': 'Please fill this required field'})
    follicle_count_right = forms.IntegerField(error_messages={'required': 'Please fill this required field'})
    ovarian_volume_left = forms.FloatField(error_messages={'required': 'Please fill this required field'})
    ovarian_volume_right = forms.FloatField(error_messages={'required': 'Please fill this required field'})
