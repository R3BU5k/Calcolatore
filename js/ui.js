import { eseguiCalcolo } from './calculator.js';

let nextTabIndex = 4;

export function validateInput(input) {
    input.value = input.value.replace(/[^0-9.]/g, "");
}

export function aggiungiInput() {
    const valoriDiv = document.querySelector(".valori");
    const inputWrapper = document.createElement("div");
    inputWrapper.className = "input-wrapper";

    const inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.className = "coloreBordo input-styled numbers";
    inputElement.placeholder = "voto";
    inputElement.tabIndex = nextTabIndex++;
    inputElement.addEventListener("input", () => validateInput(inputElement));

    const removeButton = document.createElement("button");
    removeButton.textContent = "×";
    removeButton.className = "remove-input";
    removeButton.title = "Rimuovi";
    removeButton.addEventListener("click", () => inputWrapper.remove());

    inputWrapper.appendChild(inputElement);
    inputWrapper.appendChild(removeButton);
    valoriDiv.appendChild(inputWrapper);
}

export function handleCalculate() {
    const inputElements = document.querySelectorAll(".numbers");
    const inputs = Array.from(inputElements).map(el => parseFloat(el.value)).filter(v => !isNaN(v));
    const mediaRichiesta = parseFloat(document.getElementById("media").value) || 0;
    const vMax = parseFloat(document.getElementById("vmax").value) || 0;

    const risultati = eseguiCalcolo({ inputs, mediaRichiesta, vMax });

    document.getElementById("result").innerHTML = risultati.average.toFixed(2);
    document.getElementById("errore").innerHTML = "";
    document.getElementById("quanti").innerHTML = "";

    document.getElementById("testo1").innerHTML = `La media dei tuoi (${risultati.count || 0}) voti inseriti è:`;
    document.getElementById("testo2").innerText = "Soluzioni possibili per raggiungere l'obiettivo:";

    if (risultati.errore) {
        document.getElementById("errore").innerHTML = risultati.errore;
        document.getElementById("testo2").innerText = "";
        return;
    }

    if (risultati.targetRaggiunto) {
        document.getElementById("quanti").innerHTML = `<strong>${risultati.messaggio}</strong>`;
        return;
    }

    // Renderizza l'output ordinato a schermo
    let outputHTML = "";
    if (risultati.serve[0] !== risultati.average) {
        outputHTML += `• Devi prendere <strong>${risultati.i[0].toFixed(0)} volte</strong> il voto <strong>${risultati.serve[0].toFixed(2)}</strong><br><br>`;
    }

    let write = 1;
    while (write < 3) {
        if (risultati.serve[write] !== risultati.serve[write - 1] && risultati.serve[write] <= vMax) {
            outputHTML += `oppure<br>• Prendere <strong>${risultati.i[write].toFixed(0)} volte</strong> il voto <strong>${risultati.serve[write].toFixed(2)}</strong><br><br>`;
        }
        write++;
    }

    document.getElementById("quanti").innerHTML = outputHTML;
}