
const currentDisplay = document.getElementById("current");
const previousDisplay = document.getElementById("previous");
const buttons = document.querySelector(".buttons");

// Calculator state
let currentInput = "0";
let previousInput = "";
let operator = null;
let shouldResetScreen = false;

function updateDisplay() {
    currentDisplay.textContent = currentInput;
    previousDisplay.textContent = previousInput;
}

function inputNumber(number) {
    if (currentInput === "Error") clearCalculator();

    if (shouldResetScreen) {
        currentInput = number;
        shouldResetScreen = false;
    } else if (currentInput === "0") {
        currentInput = number;
    } else if (currentInput.replace("-", "").length < 15) {
        currentInput += number;
    }

    updateDisplay();
}

function chooseOperator(selectedOperator) {
    if (currentInput === "Error") return;

    if (operator && !shouldResetScreen) {
        calculate();
    }

    previousInput = currentInput;
    operator = selectedOperator;
    shouldResetScreen = true;

    updateDisplay();
}

function calculate() {
    if (!operator || shouldResetScreen) return;

    const firstNumber = Number(previousInput);
    const secondNumber = Number(currentInput);

    let result;

    switch (operator) {
        case "+":
            result = firstNumber + secondNumber;
            break;
        case "-":
            result = firstNumber - secondNumber;
            break;
        case "*":
            result = firstNumber * secondNumber;
            break;
        case "/":
            if (secondNumber === 0) {
                currentInput = "Error";
                previousInput = "Cannot divide by zero";
                operator = null;
                shouldResetScreen = true;
                updateDisplay();
                return;
            }
            result = firstNumber / secondNumber;
            break;
    }

    if (!Number.isFinite(result)) {
        currentInput = "Error";
    } else {
        currentInput = String(Number(result.toPrecision(12)));
    }

    previousInput = "";
    operator = null;
    shouldResetScreen = true;

    updateDisplay();
}

function clearCalculator() {
    currentInput = "0";
    previousInput = "";
    operator = null;
    shouldResetScreen = false;
    updateDisplay();
}

function deleteNumber() {
    if (currentInput === "Error" || shouldResetScreen) {
        clearCalculator();
        return;
    }

    currentInput = currentInput.slice(0, -1) || "0";

    if (currentInput === "-") currentInput = "0";

    updateDisplay();
}

function addDecimal() {
    if (currentInput === "Error") clearCalculator();

    if (shouldResetScreen) {
        currentInput = "0";
        shouldResetScreen = false;
    }

    if (!currentInput.includes(".")) {
        currentInput += ".";
    }

    updateDisplay();
}

function toggleSign() {
    if (currentInput === "Error") return;

    currentInput = String(Number(currentInput) * -1);
    updateDisplay();
}

function percentage() {
    if (currentInput === "Error") return;

    currentInput = String(Number(currentInput) / 100);
    updateDisplay();
}

// Button events
buttons.addEventListener("click", function(event) {
    const button = event.target;

    if (!button.matches("button")) return;

    if (button.dataset.number !== undefined) {
        inputNumber(button.dataset.number);
    }

    if (button.dataset.operator) {
        chooseOperator(button.dataset.operator);
    }

    switch (button.dataset.action) {
        case "clear":
            clearCalculator();
            break;
        case "delete":
            deleteNumber();
            break;
        case "decimal":
            addDecimal();
            break;
        case "sign":
            toggleSign();
            break;
        case "percent":
            percentage();
            break;
        case "equals":
            calculate();
            break;
    }
});

// Keyboard support
document.addEventListener("keydown", function(event) {
    if (/^[0-9]$/.test(event.key)) {
        inputNumber(event.key);
    } else if (event.key === ".") {
        addDecimal();
    } else if (["+", "-", "*", "/"].includes(event.key)) {
        chooseOperator(event.key);
    } else if (event.key === "Enter" || event.key === "=") {
        calculate();
    } else if (event.key === "Backspace") {
        deleteNumber();
    } else if (event.key === "Escape") {
        clearCalculator();
    }
});

updateDisplay();
