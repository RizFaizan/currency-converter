// API configuration - add your own key here
const apiKey = "e5902753eb1b9a5ef38a3b2f";
const apiUrl = "https://v6.exchangerate-api.com/v6/";

// DOM elements
const fromCurrency = document.getElementById("from-currency");
const toCurrency = document.getElementById("to-currency");
const amountInput = document.getElementById("amount");
const resultDiv = document.getElementById("result");
const conversionDetails = document.getElementById("conversion-details");
const errorDiv = document.getElementById("error");
const successDiv = document.getElementById("success");
const swapButton = document.getElementById("swap-currencies");
const convertButton = document.getElementById("convert-btn");
const lastUpdated = document.getElementById("last-updated");

// Show success message for API connection
successDiv.style.display = "block";
setTimeout(() => {
    successDiv.style.display = "none";
}, 3000);

// Fetch available currencies and populate dropdowns
async function populateCurrencies() {
    try {
        convertButton.innerHTML = '<span class="loading"></span> Loading...';
        convertButton.disabled = true;

        const response = await fetch(`${apiUrl}${apiKey}/codes`);
        const data = await response.json();

        if (data.result === "success") {
            // Clear any existing options
            fromCurrency.innerHTML = "";
            toCurrency.innerHTML = "";

            // Add currencies to dropdowns
            data.supported_codes.forEach((currency) => {
                const option1 = document.createElement("option");
                const option2 = document.createElement("option");
                option1.value = currency[0];
                option1.textContent = `${currency[0]} - ${currency[1]}`;
                option2.value = currency[0];
                option2.textContent = `${currency[0]} - ${currency[1]}`;
                fromCurrency.appendChild(option1);
                toCurrency.appendChild(option2);
            });

            // Set default currencies
            fromCurrency.value = "USD";
            toCurrency.value = "EUR";

            // Perform initial conversion
            convertCurrency();
        } else {
            showError("Failed to load currencies. Please try again.");
        }

        convertButton.innerHTML =
            '<i class="fas fa-sync-alt"></i> Convert Now';
        convertButton.disabled = false;
    } catch (error) {
        showError(
            "Error fetching currency data. Please check your connection."
        );
        console.error("Error:", error);
        convertButton.innerHTML =
            '<i class="fas fa-sync-alt"></i> Convert Now';
        convertButton.disabled = false;
    }
}

// Convert currency using the API
async function convertCurrency() {
    const amount = parseFloat(amountInput.value);
    const from = fromCurrency.value;
    const to = toCurrency.value;

    if (isNaN(amount) || amount <= 0) {
        showError("Please enter a valid amount");
        return;
    }

    try {
        convertButton.innerHTML =
            '<span class="loading"></span> Converting...';
        convertButton.disabled = true;
        resultDiv.textContent = "...";

        const response = await fetch(
            `${apiUrl}${apiKey}/pair/${from}/${to}/${amount}`
        );
        const data = await response.json();

        if (data.result === "success") {
            displayResult(
                amount,
                from,
                data.conversion_result,
                to,
                data.conversion_rate
            );
            errorDiv.style.display = "none";
        } else {
            showError("Conversion failed. Please try again.");
        }

        convertButton.innerHTML =
            '<i class="fas fa-sync-alt"></i> Convert Now';
        convertButton.disabled = false;
    } catch (error) {
        showError("Error during conversion. Please check your connection.");
        console.error("Error:", error);
        convertButton.innerHTML =
            '<i class="fas fa-sync-alt"></i> Convert Now';
        convertButton.disabled = false;
    }
}

// Display conversion result
function displayResult(amount, from, result, to, rate) {
    resultDiv.textContent = result.toFixed(2);
    conversionDetails.textContent = `${amount} ${from} = ${result.toFixed(
        2
    )} ${to} (Rate: 1 ${from} = ${rate.toFixed(4)} ${to})`;
    errorDiv.style.display = "none";

    // Update last updated time
    const now = new Date();
    lastUpdated.textContent = `Last updated: ${now.toLocaleTimeString()}`;
}

// Show error message
function showError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = "block";
    resultDiv.textContent = "0.00";
}

// Swap currencies
swapButton.addEventListener("click", () => {
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
    convertCurrency();
});

// Set up event listeners
convertButton.addEventListener("click", convertCurrency);
amountInput.addEventListener("input", convertCurrency);
fromCurrency.addEventListener("change", convertCurrency);
toCurrency.addEventListener("change", convertCurrency);

// Initialize on page load
populateCurrencies();