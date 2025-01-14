"use stric";

const $untrimmedSVGCode = document.querySelector(".untrimmed .code");
const $untrimmedSVGContainer = document.querySelector(".untrimmed .svg-container");

const $trimmedSVGCode = document.querySelector(".trimmed .code");
const $trimmedSVGContainer = document.querySelector(".trimmed .svg-container");

$untrimmedSVGCode.addEventListener("input", trimSVG);

function trimSVG() {
  sanitizeInput();
  try {
    $untrimmedSVGContainer.innerHTML = $untrimmedSVGCode.value;
    const $untrimmedSVG = $untrimmedSVGContainer.firstChild;
    const bbox = $untrimmedSVG.getBBox();
    const viewBox = [bbox.x, bbox.y, bbox.width, bbox.height].join(" ");

    const $trimmedSVG = $untrimmedSVG.cloneNode(true);
    $trimmedSVG.setAttribute("viewBox", viewBox);
    $trimmedSVG.removeAttribute("width");
    $trimmedSVG.removeAttribute("height");
    $trimmedSVGCode.value = $trimmedSVG.outerHTML;
    $trimmedSVGContainer.innerHTML = $trimmedSVG.outerHTML;
  } catch (e) {
    console.log(e);
    $trimmedSVGContainer.innerText = "TRIMMED SVG PREVIEW";
    $untrimmedSVGContainer.innerHTML = "UNTRIMMED SVG PREVIEW";
    $trimmedSVGCode.value = "";
  }
}

function sanitizeInput() {
  // Tira tudo que estiver fora de <svg></svg>
  const array = $untrimmedSVGCode.value.match(/((.|\n)*(<svg(.|\n)*>(.|\n)*<\/svg>))/);
  $untrimmedSVGCode.value = array[3];
}

const $copyButton = document.querySelector(".copy-button");
const $outputContainer = document.querySelector(".output-container");
$copyButton.addEventListener("click", (evt) => {
  if ($trimmedSVGCode.value != "") {
    /* Select the text field */
    $trimmedSVGCode.select();
    $trimmedSVGCode.setSelectionRange(0, 99999); /* For mobile devices */

    /* Copy the text inside the text field */
    document.execCommand("copy");
    $outputContainer.classList.add("copied");
    setTimeout(() => $outputContainer.classList.remove("copied"), 5000);
  }
});

// Add file button
const $fileSelector = document.querySelector("#file-selector");
$fileSelector.addEventListener("change", (e) => {
  const file = e.target.files[0];

  if (!file) return;

  const reader = new FileReader();
  reader.readAsText(file, "UTF-8");

  reader.onload = (e) => {
    $untrimmedSVGCode.value = e.target.result;

    trimSVG();
  };

  reader.onerror = (e) => {
    console.log(e.target.error);
    $untrimmedSVGCode.placeholder = "<!-- Erro ao ler arquivo :/ -->";
  };
});

// Drop file
const $main = document.querySelector("main");
const $dropZone = document.querySelector(".dropzone");

$main.addEventListener("dragover", (e) => {
  e.stopPropagation();
  e.preventDefault();

  $dropZone.classList.add("active");

  e.dataTransfer.dropEffect = "copy";
});

$main.addEventListener("dragleave", (e) => {
  $dropZone.classList.remove("active");
});

$main.addEventListener("drop", (e) => {
  e.stopPropagation();
  e.preventDefault();
  $dropZone.classList.remove("active");

  const file = e.dataTransfer.files[0];

  if (!file) return;

  if (!file.type.includes("svg")) {
    $untrimmedSVGCode.placeholder = "<!-- Only .svg files are allowed -->";
    return;
  }

  const reader = new FileReader();
  reader.readAsText(file, "UTF-8");

  reader.onload = (e) => {
    $untrimmedSVGCode.value = e.target.result;

    trimSVG();
  };

  reader.onerror = (e) => {
    console.log(e.target.error);
    $untrimmedSVGCode.placeholder = "<!-- Error on file read :/ -->";
  };
});
