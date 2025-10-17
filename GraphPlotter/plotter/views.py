import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
import math
import io
import base64
from django.shortcuts import render
# from django.http import HttpResponse
from .forms import EquationForm


def index(request):
    if request.method == 'POST':
        form = EquationForm(request.POST)
        if form.is_valid():
            equation_str = form.cleaned_data['equation']
            x_min = form.cleaned_data['x_min']
            x_max = form.cleaned_data['x_max']

            try:
                plot_url = create_plot(equation_str, x_min, x_max)
                return render(request, 'plotter/plot.html', {
                    'form': form,
                    'plot_url': plot_url,
                    'equation': equation_str,
                })
            except Exception as e:
                form.add_error('equation', f'Ошибка построения графика: {str(e)}')
    else:
        form = EquationForm()

    return render(request, 'plotter/index.html', {'form': form})


def create_plot(equation_str, x_min, x_max):
    x = np.linspace(x_min, x_max, 1000)
    y = evaluate_equation(equation_str, x)

    plt.figure(figsize=(10, 6))
    plt.plot(x, y, 'b-', linewidth=2)
    plt.grid(True, alpha=0.3)
    plt.xlabel('X')
    plt.ylabel('Y')
    plt.title(f'График функции: {equation_str}')
    plt.axhline(y=0, color='k', linewidth=0.5)
    plt.axvline(x=0, color='k', linewidth=0.5)

    buffer = io.BytesIO()
    plt.savefig(buffer, format='png', dpi=100, bbox_inches='tight')
    buffer.seek(0)
    plt.close()

    image_png = buffer.getvalue()
    buffer.close()
    graphic = base64.b64encode(image_png)
    graphic = graphic.decode('utf-8')

    return graphic


def evaluate_equation(equation_str, x_values):
    y_values = []
    for x in x_values:
        try:
            y = eval(equation_str, {'x': x, 'math': math, 'np': np, 'sin': math.sin,
                                    'cos': math.cos, 'tan': math.tan, 'exp': math.exp,
                                    'log': math.log, 'sqrt': math.sqrt})
            y_values.append(y)
        except ZeroDivisionError:
            y_values.append(np.nan)
        except Exception as e:
            raise ValueError(f"Ошибка вычисления уравнения при x={x}: {str(e)}")

    return np.array(y_values)


def examples(request):
    examples = [
        {'type': 'Парабола', 'equation': 'x**2', 'description': 'y = x²'},
        {'type': 'Кубическая парабола', 'equation': 'x**3', 'description': 'y = x³'},
        {'type': 'Гипербола', 'equation': '1/x', 'description': 'y = 1/x'},
        {'type': 'Синусоида', 'equation': 'math.sin(x)', 'description': 'y = sin(x)'},
    ]
    return render(request, 'plotter/examples.html', {'examples': examples})