from django import forms


class EquationForm(forms.Form):
    equation = forms.CharField(
        max_length=200,
        label='Уравнение',
        initial='x**2',
        help_text='Используйте синтаксис Python: x**2 для x², math.sin(x) для sin(x) и т.д.',
        widget=forms.TextInput(attrs={'class': 'form-control'})
    )

    x_min = forms.FloatField(
        label='Минимальное значение X',
        initial=-10,
        widget=forms.NumberInput(attrs={'class': 'form-control'})
    )

    x_max = forms.FloatField(
        label='Максимальное значение X',
        initial=10,
        widget=forms.NumberInput(attrs={'class': 'form-control'})
    )