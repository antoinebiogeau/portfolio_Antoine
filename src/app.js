/*document.addEventListener("DOMContentLoaded", e => {
    e.preventDefault();
    console.log("chargé");
    let parents, child, i, target;
    child = ["Linux", "OS", "Android"];
    parents = document.querySelectorAll("section")[1];
    for (let i = 0; i < parents.childNodes.length; i++) {
        console.log(parents.childNodes[i]);
    }
    el = document.createElement("ul");
    parents.prepend(el);
    for (data of child) {
        el.innerHTML += `<li>${data}</<li>`;
    }
    target = document.querySelector("footer p");
    let date = new Date();
    console.log(date.getFullYear());
    target.innerHTML += date.getFullYear();
});*/
document.addEventListener("DOMContentLoaded", () => {
    console.log("loaded");
    let btn = document.querySelector(".material-icons");
    let el = document.querySelector("nav");
    btn.addEventListener("click", () => {
        el.classList.toggle("open-menu");
    });
});