document.addEventListener("DOMContentLoaded", hentData);
let container = document.querySelector("#container");
let template = document.querySelector("template");
let filter = "alle";
let burgerKnap = document.querySelector("#burgerknap");
let menu = document.querySelector("nav");
let kager;
let popup = document.querySelector("#popup");
let logo = document.querySelector("#logo");
let kageTitel = document.querySelector("#kageTitel");
let forside = document.querySelector("#forside");

async function hentData() {
    console.log("hent data og vis kager");
    logo.addEventListener("click", startForside);

    //https://docs.google.com/spreadsheets/d/1RpJ2ywcmwKWlxFSHDWm3-_DR0rgJQfmc7_7T9LjAJfA/edit#gid=0

    const link = "https://spreadsheets.google.com/feeds/list/1RpJ2ywcmwKWlxFSHDWm3-_DR0rgJQfmc7_7T9LjAJfA/od6/public/values?alt=json";
    const respons = await fetch(link);
    kager = await respons.json();
    console.log(kager);

    startForside();
};

function startForside() {
    forside.style.display = "block";
    container.style.display = "none";
    kageTitel.style.display = "none";
    burgerKnap.addEventListener("click", toggleMenu);
    addButtons();
};

function vis() {
    console.log("viser kager");
    console.log(kager);
    forside.style.display = "none";
    container.style.display = "grid";
    kageTitel.style.display = "block";
    container.innerHTML = "";
    kager.feed.entry.forEach((kage) => {
        if (filter == "alle" || filter == kage.gsx$type.$t) {
            const klon = template.cloneNode(true).content;
            klon.querySelector("h3").textContent = kage.gsx$navn.$t;
            klon.querySelector("img").src = "img/kage(" + kage.gsx$billede.$t + ").jpg";
            klon.querySelector("article").addEventListener("click", () => visDetaljer(kage));
            container.appendChild(klon);
            console.log("appendChild");
        }
    });
};

function toggleMenu() {
    console.log("toggleMenu");
    menu.classList.toggle("hidden");

    burgerKnap.textContent = "=";

    if (menu.classList.contains("hidden")) {
        burgerKnap.textContent = "=";
    } else {
        burgerKnap.textContent = "X";
    }
};

function addButtons() {
    console.log("addButtons -> adds eventlisteners to buttons")
    document.querySelectorAll(".filter").forEach((btn) => {
        btn.addEventListener("click", filterBtn);
    });
};

function filterBtn() {
    console.log("filterBtn: " + this.textContent);
    filter = this.dataset.kategori;
    console.log(filter);
    document.querySelectorAll(".filter").forEach((btn) => {
        btn.classList.remove("valgt");
    });
    this.classList.add("valgt");
    kageTitel.textContent = this.textContent;
    vis();
};

function visDetaljer(kage) {
    console.log(kage);
    popup.style.display = "block";
    popup.querySelector("#popbillede").src = "img/kage(" + kage.gsx$billede.$t + ").jpg";
    popup.querySelector("#popnavn").textContent = kage.gsx$navn.$t;
    popup.querySelector("#popopskrift").innerHTML = kage.gsx$opskrift.$t;
}


document.querySelector("#luk").addEventListener("click", () => {
    popup.style.display = "none";
    popup.querySelector("#luk").textContent = "X";
});

popup.addEventListener("click", () => {
    popup.style.display = "none";
});
