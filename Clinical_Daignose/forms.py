from django import forms

class PCOSInputForm(forms.Form):
    cycle_length_days = forms.IntegerField()
    cycles_per_year = forms.IntegerField()

    total_testosterone = forms.FloatField()
    shbg = forms.FloatField()
    fasting_insulin = forms.FloatField()
    fasting_glucose = forms.FloatField()

    tsh = forms.FloatField()
    prolactin = forms.FloatField()
    crp = forms.FloatField()

    follicle_count_left = forms.IntegerField()
    follicle_count_right = forms.IntegerField()
    ovarian_volume_left = forms.FloatField()
    ovarian_volume_right = forms.FloatField()
