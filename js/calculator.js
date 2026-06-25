export function eseguiCalcolo({ inputs, mediaRichiesta, vMax }) {
    let sum = 0;
    let count = 0;

    inputs.forEach(val => {
        if (!isNaN(val)) {
            sum += val;
            count++;
        }
    });

    const average = count > 0 ? sum / count : 0;

    if (average >= mediaRichiesta) {
        return { average, targetRaggiunto: true, messaggio: "Ottimo! La tua media attuale soddisfa o supera già l'obiettivo." };
    }

    const serve = new Array(4).fill(1);
    const i = new Array(4).fill(1);

    // Calcolo del primo blocco necessario
    serve[0] = (mediaRichiesta * (count + i[0]) - sum) / i[0];
    while (serve[0] > vMax || serve[0] < 0) {
        if (i[0] >= 1000) {
            return { average, errore: "Impossibile raggiungere la media richiesta con i parametri inseriti." };
        }
        i[0] += 1;
        serve[0] = (mediaRichiesta * (count + i[0]) - sum) / i[0];
    }

    // Calcolo proiezioni secondarie progressive
    for (let j = 1; j <= 3; j++) {
        i[j] = i[j - 1] + 1;
        serve[j] = (mediaRichiesta * (count + i[j]) - sum) / i[j];
        while (serve[j] > vMax) {
            i[j] += 1;
            serve[j] = (mediaRichiesta * (count + i[j]) - sum) / i[j];
        }
    }

    // Arrotondamento standard per eccesso sui quartili commerciali
    for (let arr = 0; arr < 4; arr++) {
        let a = Math.floor(serve[arr]);
        let diff = serve[arr] - a;
        if (diff >= 0.01 && diff <= 0.15) serve[arr] = a + 0.15;
        else if (diff >= 0.16 && diff <= 0.5) serve[arr] = a + 0.5;
        else if (diff >= 0.51 && diff <= 0.85) serve[arr] = a + 0.85;
        else if (diff >= 0.86 && diff <= 1) serve[arr] = a + 1.0;
    }

    return { average, serve, i, count, sum, targetRaggiunto: false };
}