const operationDisplay = document.querySelector(".calculator__display_operation");
const resultDisplay = document.querySelector(".calculator__display_result");
const buttonsContainer = document.querySelector(".calculator__buttons");

let currentInput = "0";
let previousInput = "";
let operation = "";
let fullOperation = "";
let resetInput = false;

const buttonsList = [
    ["%", calculatePercent],
    ["C", clearAll],
    ["←", undoAction],
    ["÷", () => appendOperator("÷")],
    ["7", () => appendNumber(7)],
    ["8", () => appendNumber(8)],
    ["9", () => appendNumber(9)],
    ["x", () => appendOperator("x")],
    ["4", () => appendNumber(4)],
    ["5", () => appendNumber(5)],
    ["6", () => appendNumber(6)],
    ["–", () => appendOperator("–")],
    ["1", () => appendNumber(1)],
    ["2", () => appendNumber(2)],
    ["3", () => appendNumber(3)],
    ["+", () => appendOperator("+")],
    ["+/-", reverseNumber],
    ["0", () => appendNumber(0)],
    [".", appendDecimal],
    ["=", calculate]
]

buttonsList.forEach(([text, handler]) => {
    const button = document.createElement("button");
    button.textContent = text;
    button.addEventListener("click", handler);
    if (text === "←") {
        button.className = "button__undo";
    } else if (text === "=") {
        button.className = "button__calculate";
    } else if (["÷", "x", "–", "+"].includes(text)) {
        button.className = "button__operation";
    } else if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(text)) {
        button.className = "button__number";
    } else {
        button.className = "button__option";
    }
    buttonsContainer.appendChild(button);
});

function updateDisplay() {
    operationDisplay.value = fullOperation;
    if (operation === "" && !fullOperation) {
        operationDisplay.value = "0";
        resultDisplay.value = "";
    }
}

function appendNumber(number) {
    if (resetInput) {
        previousInput = currentInput;
        currentInput = number.toString();
        fullOperation = previousInput + operation + currentInput;
        resetInput = false;
    } else if (currentInput === "0") {
        currentInput = number.toString();
        fullOperation = operation ? previousInput + operation + currentInput : currentInput;
    } else {
        currentInput += number.toString();
        fullOperation += number.toString();
    }
    updateDisplay();
}

function appendOperator(operator) {
    if (operation !== "" && !resetInput) {
        calculate();
    }
    operation = operator;
    fullOperation = currentInput + operator;
    resetInput = true;
    updateDisplay();
}

function appendDecimal() {
    if (resetInput) {
        currentInput = "0.";
        fullOperation = previousInput + operation + currentInput;
        resetInput = false;
    } else if (!currentInput.includes(".")) {
        currentInput += ".";
        fullOperation += ".";
    }
    updateDisplay();
}

function reverseNumber() {
    if (currentInput === "0") return;
    currentInput = currentInput.startsWith("-")
        ? currentInput.slice(1)
        : "-" + currentInput;

    if (operation && previousInput) {
        fullOperation = previousInput + operation + currentInput;
    } else {
        fullOperation = currentInput;
    }
    updateDisplay();
}

function calculate() {
    if (resultDisplay.value !== "" && operationDisplay.value.includes("%")) {
        currentInput = resultDisplay.value;
        fullOperation = "";
        operation = "";
        resetInput = true;
        return;
    }

    if (operation === "" || resetInput) return;

    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    switch (operation) {
        case "+":
            result = prev + current;
            break;
        case "–":
            result = prev - current;
            break;
        case "x":
            result = prev * current;
            break;
        case "÷":
            result = prev / current;
            break;
        default:
            return;
    }

    resultDisplay.value = result.toString();
    currentInput = result.toString();
    fullOperation = "";
    operation = "";
    resetInput = true;
}

function calculatePercent() {
    if (currentInput === "0") return;

    let result;
    if (operation && previousInput) {
        const base = parseFloat(previousInput);
        const percentValue = parseFloat(currentInput);
        result = base + (base * percentValue / 100);
        fullOperation = previousInput + operation + currentInput + "%";
    } else {
        const value = parseFloat(currentInput);
        result = value / 100;
        fullOperation = currentInput + "%";
    }
    operationDisplay.value = fullOperation;
    resultDisplay.value = result.toString();
    currentInput = result.toString();
    resetInput = true;
}

function clearAll() {
    currentInput = "0";
    previousInput = "";
    operation = "";
    resetInput = false;
    fullOperation = "";
    operationDisplay.value = "0";
    resultDisplay.value = "";
}

function undoAction() {
    if (currentInput.length === 1 || (currentInput.length === 2 && currentInput.startsWith("-"))) {
        currentInput = "0";
        fullOperation = fullOperation.slice(0, -1);
    } else {
        currentInput = currentInput.slice(0, -1);
        fullOperation = fullOperation.slice(0, -1);
    }
    updateDisplay();
}

updateDisplay();