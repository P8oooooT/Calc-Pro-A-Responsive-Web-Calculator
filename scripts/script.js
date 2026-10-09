const display = document.querySelector('.display');
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const clearButton = document.querySelector('.clear');
const deleteButton = document.querySelector('.delete');
const decimalButton = document.querySelector('.decimal');
const equalsButton = document.querySelector('.equals');

let currentInput = '0';
let previousInput = null;
let operator = null;
let shouldResetDisplay = false;

function updateDisplay() {
    display.textContent = currentInput;
}

function clearCalculator() {
    currentInput = '0';
    previousInput = null;
    operator = null;
    shouldResetDisplay = true;
    updateDisplay();
}

function appendNumber(value) {
    if (currentInput === 'Error') {
        currentInput = '';
    }

    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }

    if (currentInput === '0' && value !== '.') {
        currentInput = value;
    }
    
    else {
        currentInput += value;
    }

    updateDisplay();
}

function applyDecimal() {
    if (currentInput === 'Error') {
        currentInput = '0';
    }

    if (shouldResetDisplay) {
        currentInput = '0';
        shouldResetDisplay = false;
    }

    if (!currentInput.includes('.')) {
        currentInput += '.';
    }

    updateDisplay();
}

function compute(previousValue, currentValue, selectedOperator) {
    switch (selectedOperator) {
        case '+':
            return previousValue + currentValue;
        case '-':
            return previousValue - currentValue;
        case '*':
            return previousValue * currentValue;
        case '/':
            if (currentValue === 0) {
                return 'Error';
            }
            return previousValue / currentValue;
        default:
            return currentValue;
    }
}

function performCalculation() {
    if (previousInput === null || operator === null || currentInput === 'Error') {
        return;
    }

    const result = compute(previousInput, Number(currentInput), operator);

    if (result === 'Error') {
        currentInput = 'Error';
        previousInput = null;
        operator = null;
        shouldResetDisplay = true;
        updateDisplay();
        return;
    }

    currentInput = String(result);
    previousInput = null;
    operator = null;
    shouldResetDisplay = true;
    updateDisplay();
}

function setOperator(nextOperator) {
    if (currentInput === 'Error') {
        return;
    }

    const inputValue = Number(currentInput);

    if (previousInput === null) {
        previousInput = inputValue;
        operator = nextOperator;
        shouldResetDisplay = true;
        return;
    }

    if (!shouldResetDisplay) {
        const result = compute(previousInput, inputValue, operator);
        previousInput = result;
        currentInput = String(result);
        operator = nextOperator;
        shouldResetDisplay = true;
        updateDisplay();
        return;
    }

    operator = nextOperator;
}

function deleteLastDigit() {
    if (currentInput === 'Error') {
        clearCalculator();
        return;
    }

    if (shouldResetDisplay) {
        currentInput = '0';
        shouldResetDisplay = false;
        updateDisplay();
        return;
    }

    if (currentInput.length <= 1) {
        currentInput = '0';
    } else {
        currentInput = currentInput.slice(0, -1);
    }

    updateDisplay();
}

numberButtons.forEach((button) => {
    button.addEventListener('click', () => appendNumber(button.textContent.trim()));
});

operatorButtons.forEach((button) => {
    button.addEventListener('click', () => setOperator(button.textContent.trim()));
});

clearButton.addEventListener('click', clearCalculator);
deleteButton.addEventListener('click', deleteLastDigit);
decimalButton.addEventListener('click', applyDecimal);
equalsButton.addEventListener('click', performCalculation);

document.addEventListener('keydown', (event) => {
    const key = event.key;

    if (/^[0-9]$/.test(key)) {
        appendNumber(key);
        return;
    }

    if (key === '.') {
        applyDecimal();
        return;
    }

    if (['+', '-', '*', '/'].includes(key)) {
        setOperator(key);
        return;
    }

    if (key === 'Enter' || key === '=') {
        performCalculation();
        return;
    }

    if (key === 'Backspace') {
        deleteLastDigit();
        return;
    }

    if (key === 'Escape') {
        clearCalculator();
    }
});

updateDisplay();
