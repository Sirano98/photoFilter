"use strict"

const nextBtn = document.querySelector(".btn-next");
const saveBtn = document.querySelector(".btn-save");
const loadBtn = document.querySelector("input[type='file']");
const resetBtn = document.querySelector(".btn-reset");
const filters = document.querySelector(".filters");
const output = document.querySelectorAll("output");
const canvas = document.querySelector("canvas");
const img = document.querySelector("img");
const initialFilters = getComputedStyle(img).filter;
const ctx = canvas.getContext("2d");
const buttons = document.querySelector(".btn-container");
const fullScreenBtn = document.querySelector(".fullscreen");

let photoNumber = 0;

nextBtn.addEventListener("click", createLink);
saveBtn.addEventListener("click", saveImage);
loadBtn.addEventListener("change", loadImage);
resetBtn.addEventListener("click", resetFilters);
filters.addEventListener("input", changeFilter);
buttons.addEventListener("click", toggleActiveMode)
fullScreenBtn.addEventListener("click", toggleFullScreenMode);

function toggleActiveMode(event) {
    for (let btn of buttons.children) {
        btn.classList.remove("btn-active");
    }
    event.target.tagName === "input".toUpperCase() ? event.target.parentElement.classList.add("btn-active") : event.target.classList.add("btn-active");
}

function getCurrentTime() {
    let currentTime = new Date().getHours();

    if (currentTime >= 6 && currentTime <= 11) {
        return "morning";
    } else if (currentTime >= 12 && currentTime <= 17) {
        return "day";
    } else if (currentTime >= 18 && currentTime <= 23) {
        return "evening";
    } else {
        return "night";
    }
}

function createLink() {
    if (photoNumber === 20) {
        photoNumber = 0;
    }
    photoNumber++;
    let link = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${getCurrentTime()}/${photoNumber < 10 ? '0' + photoNumber : photoNumber}.jpg`;
    changeImage(link);
}

function changeImage(src) {
    img.setAttribute('crossOrigin', 'anonymous');
    img.src = src;
    img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
    };
}

function saveImage() {
    ctx.filter = getComputedStyle(canvas).filter;
    ctx.drawImage(img, 0, 0);
    let downloadLink = document.createElement("a");
    downloadLink.download = "download.png";
    downloadLink.href = canvas.toDataURL();
    downloadLink.click();
    downloadLink.delete;
    ctx.filter = initialFilters;
    ctx.drawImage(img, 0, 0);
}

function loadImage() {
    const file = loadBtn.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        changeImage(reader.result);
        loadBtn.value = "";
    }
    reader.readAsDataURL(file);
}

function changeFilter(event) {
    let target = event.target;
    target.nextElementSibling.value = target.value;
    document.documentElement.style.setProperty(`--${target.name}`, `${target.value}${target.dataset.sizing}`);
}

function resetFilters() {
    for (let elem of filters.children) {
        for (let child of elem.children) {
            if (child.tagName === "input".toUpperCase()) {
                child.name === "saturate" ? (child.value = 100, child.nextElementSibling.value = 100) : (child.value = 0, child.nextElementSibling.value = 0);
                document.documentElement.style.setProperty(`--${child.name}`, `${child.value}${child.dataset.sizing}`);
            }
        }
    }
}

function toggleFullScreenMode() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

changeImage("assets/img/img.jpg");