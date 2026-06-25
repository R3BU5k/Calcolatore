import { getCookie, setCookie, deleteCookie } from './cookies.js';
import { initTheme, toggleTheme, caricaColoriSalvati, applicaColoreGenerale, applicaColoreBordi, applicaBackgroundBottoni, applicaColoreTestoBottoni } from './theme.js';
import { aggiungiInput, handleCalculate, validateInput } from './ui.js';

// Funzione per caricare dinamicamente lo script di Google Analytics
function attivaGoogleAnalytics() {
    if (document.getElementById('gtag-script')) return; // Evita duplicati

    // Aggiorna il consenso per Google
    gtag('consent', 'update', {
        'analytics_storage': 'granted'
    });

    // Carica il file esterno di Google
    const script = document.createElement('script');
    script.id = 'gtag-script';
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-3CMX4CY2CZ";
    document.head.appendChild(script);

    // Inizializza la configurazione
    gtag('config', 'G-3CMX4CY2CZ');
}

window.addEventListener("DOMContentLoaded", () => {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("service_worker.js")
            .then(() => console.log("SW Attivo!"))
            .catch(() => console.log("Errore SW"));
    }

    initTheme();

    const cookieBanner = document.getElementById("cookie-banner");
    const acceptCookiesButton = document.getElementById("accept-cookies");
    const themeToggle = document.getElementById("theme-toggle");

    if (!getCookie("cookie-consent")) {
        cookieBanner.style.display = "flex";
        themeToggle.style.display = "none";

        acceptCookiesButton.addEventListener("click", () => {
            setCookie("cookie-consent", "accepted", 365);
            cookieBanner.style.display = "none";
            themeToggle.style.display = "block";
            
            attivaGoogleAnalytics();
            caricaColoriSalvati();
        });
    } else {
        // ATTIVAZIONE AUTOMATICA: L'utente aveva già accettato in passato
        attivaGoogleAnalytics();
        caricaColoriSalvati();
    }

    // Listeners UI principali
    themeToggle.addEventListener("click", toggleTheme);
    document.getElementById("add-input-btn").addEventListener("click", aggiungiInput);
    document.getElementById("button").addEventListener("click", handleCalculate);
    document.getElementById("reload-page").addEventListener("click", () => window.location.reload());

    // Validazione automatica real-time su campi fissi
    ["media", "vmax"].forEach(id => {
        const el = document.getElementById(id);
        el.addEventListener("input", () => validateInput(el));
    });

    const primoVoto = document.querySelector(".numbers");
    primoVoto.addEventListener("input", () => validateInput(primoVoto));

    // Color Pickers custom personalizzabili
    document.getElementById("coloreInput").addEventListener("change", (e) => applicaColoreGenerale(e.target.value));
    document.getElementById("coloreBordi").addEventListener("change", (e) => applicaColoreBordi(e.target.value));
    document.getElementById("coloreBackgroundBottoni").addEventListener("change", (e) => applicaBackgroundBottoni(e.target.value));
    document.getElementById("coloreTestoBottoni").addEventListener("change", (e) => applicaColoreTestoBottoni(e.target.value));

    document.querySelectorAll(".delete-cookie").forEach(cell => {
        cell.addEventListener("click", () => {
            const cookieName = cell.getAttribute("data-cookie");
            deleteCookie(cookieName);
            alert(`Cookie ${cookieName} rimosso. Ricarica la pagina.`);
        });
    });
});