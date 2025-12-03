let myChart = null;


const equationInput = document.getElementById('equation');
const plotButton = document.getElementById('plot-btn');
const clearButton = document.getElementById('clear-btn');
const functionButtons = document.querySelectorAll('.function-btn');
const exampleButtons = document.querySelectorAll('.example-btn');
const minXInput = document.getElementById('minX');
const maxXInput = document.getElementById('maxX');
const errorMessage = document.getElementById('error-message');


let activeFunctionType = 'quadratic';


function evaluateEquation(expr, x) {
    try {
        
        expr = expr
            .replace(/sin\(/g, 'Math.sin(')
            .replace(/cos\(/g, 'Math.cos(')
            .replace(/tan\(/g, 'Math.tan(')
            .replace(/log\(/g, 'Math.log10(')
            .replace(/ln\(/g, 'Math.log(')
            .replace(/sqrt\(/g, 'Math.sqrt(')
            .replace(/abs\(/g, 'Math.abs(')
            .replace(/π/g, 'Math.PI')
            .replace(/e/g, 'Math.E')
            .replace(/\^/g, '**');
        
        
        const func = new Function('x', `return ${expr};`);
        return func(x);
    } catch (error) {
        throw new Error('Ошибка вычисления выражения: ' + error.message);
    }
}


function generateGraphData(equation, minX, maxX, steps = 200) {
    const data = [];
    const step = (maxX - minX) / steps;
    
    for (let x = minX; x <= maxX; x += step) {
        try {
            const y = evaluateEquation(equation, x);
            
            
            if (isFinite(y)) {
                data.push({ x: x, y: y });
            } else {
                
                data.push({ x: x, y: null });
            }
        } catch (error) {
            
            data.push({ x: x, y: null });
        }
    }
    
    return data;
}


function plotGraph() {
    const equation = equationInput.value.trim();
    const minX = parseFloat(minXInput.value);
    const maxX = parseFloat(maxXInput.value);
    
    
    if (!equation) {
        showError('Введите уравнение');
        return;
    }
    
    if (isNaN(minX) || isNaN(maxX) || minX >= maxX) {
        showError('Укажите корректный диапазон значений X');
        return;
    }
    
    try {

        hideError();
        

        const graphData = generateGraphData(equation, minX, maxX);
        

        const labels = graphData.map(point => point.x.toFixed(2));
        const dataPoints = graphData.map(point => point.y);
        

        let borderColor = '#bb86fc';
        switch(activeFunctionType) {
            case 'quadratic': borderColor = '#bb86fc'; break;
            case 'linear': borderColor = '#03dac6'; break;
            case 'hyperbola': borderColor = '#ff6b6b'; break;
            case 'trigonometric': borderColor = '#ffd166'; break;
        }
        
       
        if (myChart) {
            myChart.data.labels = labels;
            myChart.data.datasets[0].data = dataPoints;
            myChart.data.datasets[0].label = `y = ${equation}`;
            myChart.data.datasets[0].borderColor = borderColor;
            myChart.update();
        } else {
          
            const ctx = document.getElementById('myChart').getContext('2d');
            myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: `y = ${equation}`,
                        data: dataPoints,
                        borderColor: borderColor,
                        backgroundColor: borderColor + '20',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.1,
                        pointRadius: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: {
                                color: '#f5f5f5',
                                font: {
                                    size: 14
                                }
                            }
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            titleColor: '#f5f5f5',
                            bodyColor: '#f5f5f5'
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Ось X',
                                color: '#bbbbbb'
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#bbbbbb'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Ось Y',
                                color: '#bbbbbb'
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#bbbbbb'
                            }
                        }
                    }
                }
            });
        }
    } catch (error) {
        showError(error.message);
    }
}


function clearGraph() {
    if (myChart) {
        myChart.destroy();
        myChart = null;
    }
    hideError();
}


function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
}


function hideError() {
    errorMessage.classList.remove('show');
}


function setExampleEquation(equation) {
    equationInput.value = equation;
    
    
    if (equation.includes('^2') || equation.includes('x^2')) {
        setActiveFunctionType('quadratic');
        minXInput.value = -10;
        maxXInput.value = 10;
    } else if (equation.includes('1/x') || equation.includes('/x')) {
        setActiveFunctionType('hyperbola');
        minXInput.value = -5;
        maxXInput.value = 5;
    } else if (equation.includes('sin') || equation.includes('cos') || equation.includes('tan')) {
        setActiveFunctionType('trigonometric');
        minXInput.value = -2 * Math.PI;
        maxXInput.value = 2 * Math.PI;
    } else if (equation.includes('x') && !equation.includes('^')) {
        setActiveFunctionType('linear');
        minXInput.value = -10;
        maxXInput.value = 10;
    }
}


function setActiveFunctionType(type) {
    activeFunctionType = type;
    
   
    functionButtons.forEach(btn => {
        if (btn.dataset.type === type) {
            btn.classList.add('active');
            
            
            switch(type) {
                case 'quadratic':
                    equationInput.placeholder = "Например: x^2 - 4, 2*x^2 + 3*x - 1";
                    break;
                case 'linear':
                    equationInput.placeholder = "Например: 2*x + 3, -0.5*x - 1";
                    break;
                case 'hyperbola':
                    equationInput.placeholder = "Например: 1/x, (x+2)/(x-3)";
                    break;
                case 'trigonometric':
                    equationInput.placeholder = "Например: sin(x), cos(2*x) + 1";
                    break;
            }
        } else {
            btn.classList.remove('active');
        }
    });
}


plotButton.addEventListener('click', plotGraph);

clearButton.addEventListener('click', clearGraph);

functionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        setActiveFunctionType(btn.dataset.type);
    });
});

exampleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        setExampleEquation(btn.dataset.expr);
    });
});

equationInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        plotGraph();
    }
});


window.addEventListener('DOMContentLoaded', () => {
    plotGraph();
});