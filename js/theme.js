import { getCookie, setCookie, hasConsent } from './cookies.js';

const themeStyle = document.getElementById("theme-style");
const metaThemeColor = document.getElementById("meta-theme-color");

export function initTheme() {
    const savedTheme = getCookie("theme");
    if (savedTheme) {
        themeStyle.href = savedTheme;
    }
}

export function toggleTheme() {
    const currentHref = themeStyle.getAttribute("href");
    const newTheme = currentHref === "styles/light.css" ? "styles/dark.css" : "styles/light.css";
    themeStyle.href = newTheme;
    setCookie("theme", newTheme, 365);
}

export function applicaColoreGenerale(colore) {
    const elementiTesto = document.getElementsByClassName("colore");
    for (let el of elementiTesto) {
        el.style.color = colore;
    }
    if (metaThemeColor) metaThemeColor.content = colore;
    if (hasConsent()) setCookie("colorePreferito", colore, 30);
}

export function applicaColoreBordi(colore) {
    const elementiBordo = document.getElementsByClassName("coloreBordo");
    for (let el of elementiBordo) {
        el.style.borderColor = colore;
    }
    if (hasConsent()) setCookie("colorePreferitoBordi", colore, 30);
}

export function applicaBackgroundBottoni(colore) {
    const elementiButton = document.getElementsByClassName("btn-bgcolor");
    for (let el of elementiButton) {
        el.style.backgroundColor = colore;
    }
    if (hasConsent()) setCookie("colorePreferitoBackgroundBottoni", colore, 30);
}

export function applicaColoreTestoBottoni(colore) {
    const elementiButton = document.getElementsByClassName("btn-bgcolor");
    for (let el of elementiButton) {
        el.style.color = colore;
    }
    if (hasConsent()) setCookie("colorePreferitoTestoBottoni", colore, 30);
}

export function caricaColoriSalvati() {
    const configurazioni = [
        { id: "coloreInput", cookie: "colorePreferito", fn: applicaColoreGenerale },
        { id: "coloreBordi", cookie: "colorePreferitoBordi", fn: applicaColoreBordi },
        { id: "coloreBackgroundBottoni", cookie: "colorePreferitoBackgroundBottoni", fn: applicaBackgroundBottoni },
        { id: "coloreTestoBottoni", cookie: "colorePreferitoTestoBottoni", fn: applicaColoreTestoBottoni }
    ];

    configurazioni.forEach(config => {
        const valoreCookie = getCookie(config.cookie);
        const inputEl = document.getElementById(config.id);
        if (valoreCookie && inputEl) {
            inputEl.value = valoreCookie;
            config.fn(valoreCookie);
        }
    });
}