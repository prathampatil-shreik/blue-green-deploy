'use strict';

const display    = document.getElementById('display');
const expression = document.getElementById('expression');

let currentValue  = '0';
let previousValue = '';
let operator      = null;
let waitingForOperand = false;
let expressionStr = '';

function updateDisplay(val) {
    // Shrink font for long numbers
    display.style.fontSize = val.length > 10 ? '1.4rem' : '';
    display.textContent = val;
}

function appendDigit(digit) {
    if (waitingForOperand) {
        currentValue = digit;
        waitingForOperand = false;
    } else {
        currentValue = currentValue === '0' ? digit : currentValue + digit;
    }
    updateDisplay(currentValue);
}

function appendDot() {
    if (waitingForOperand) {
        currentValue = '0.';
        waitingForOperand = false;
        updateDisplay(currentValue);
        return;
    }
    if (!currentValue.includes('.')) {
        currentValue += '.';
        updateDisplay(currentValue);
    }
}

function setOperator(op) {
    const opSymbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };

    if (operator && !waitingForOperand) {
        calculate(true);
    }

    previousValue = currentValue;
    operator = op;
    waitingForOperand = true;
    expressionStr = previousValue + ' ' + opSymbols[op];
    expression.textContent = expressionStr;

    // Highlight active operator button
    document.querySelectorAll('.btn-op').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
}

function calculate(chained = false) {
    if (!operator || (!chained && waitingForOperand)) return;

    const prev = parseFloat(previousValue);
    const curr = parseFloat(currentValue);
    let result;

    switch (operator) {
        case '+': result = prev + curr; break;
        case '-': result = prev - curr; break;
        case '*': result = prev * curr; break;
        case '/':
            if (curr === 0) {
                updateDisplay('Cannot divide by zero');
                expression.textContent = previousValue + ' ÷ ' + currentValue + ' =';
                resetState();
                return;
            }
            result = prev / curr;
            break;
        default: return;
    }

    const opSymbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };
    if (!chained) {
        expression.textContent = previousValue + ' ' + opSymbols[operator] + ' ' + currentValue + ' =';
    }

    // Avoid floating-point noise (e.g. 0.1 + 0.2)
    result = parseFloat(result.toPrecision(12));

    currentValue = String(result);
    updateDisplay(currentValue);

    if (!chained) {
        operator = null;
        previousValue = '';
        expressionStr = '';
        document.querySelectorAll('.btn-op').forEach(b => b.classList.remove('active'));
    } else {
        previousValue = currentValue;
    }
    waitingForOperand = false;
}

function percentage() {
    const val = parseFloat(currentValue);
    if (isNaN(val)) return;
    currentValue = String(parseFloat((val / 100).toPrecision(12)));
    updateDisplay(currentValue);
}

function toggleSign() {
    if (currentValue === '0' || currentValue === 'Cannot divide by zero') return;
    currentValue = currentValue.startsWith('-')
        ? currentValue.slice(1)
        : '-' + currentValue;
    updateDisplay(currentValue);
}

function backspace() {
    if (currentValue === 'Cannot divide by zero') {
        clearAll();
        return;
    }
    currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : '0';
    updateDisplay(currentValue);
}

function clearAll() {
    resetState();
    updateDisplay('0');
    expression.textContent = '\u00a0';
    document.querySelectorAll('.btn-op').forEach(b => b.classList.remove('active'));
}

function resetState() {
    currentValue  = '0';
    previousValue = '';
    operator      = null;
    waitingForOperand = false;
    expressionStr = '';
}

// Keyboard support
document.addEventListener('keydown', e => {
    if (e.key >= '0' && e.key <= '9') appendDigit(e.key);
    else if (e.key === '.')  appendDot();
    else if (e.key === '+')  { event = { target: document.querySelector('[onclick="setOperator(\'+\')"]') }; setOperator('+'); }
    else if (e.key === '-')  { event = { target: document.querySelector('[onclick="setOperator(\'-\')"]') }; setOperator('-'); }
    else if (e.key === '*')  { event = { target: document.querySelector('[onclick="setOperator(\'*\')"]') }; setOperator('*'); }
    else if (e.key === '/')  { e.preventDefault(); event = { target: document.querySelector('[onclick="setOperator(\'/\')"]') }; setOperator('/'); }
    else if (e.key === 'Enter' || e.key === '=') calculate();
    else if (e.key === 'Backspace') backspace();
    else if (e.key === 'Escape')    clearAll();
    else if (e.key === '%')         percentage();
});
