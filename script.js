const DEFAULT_COLOR = '#333';
const DEFAULT_MODE = 'single';
const DEFAULT_SIZE = 16;

let currentColor = DEFAULT_COLOR;
let currentMode = DEFAULT_MODE;
let currentSize = DEFAULT_SIZE;

const colorBtn = document.getElementById('colorBtn');
const rainbowBtn = document.getElementById('rainbowBtn');
const eraserBtn = document.getElementById('eraserBtn');
const clearBtn = document.getElementById('clearBtn');
const saveBtn = document.getElementById('saveBtn');
const sizeValue = document.getElementById('sizeValue');
const sizeSlider = document.getElementById('sizeSlider');

const grid = document.getElementById('grid');

const colorPicker = document.getElementById('colorPicker');
const backgroundColorPicker = document.querySelector(`.background-setting input[type="color"]`);

// Before painting, user selects the colors to work with 
colorPicker.addEventListener('input', setCurrentColor);
function setCurrentColor(e) {
    currentColor = e.target.value;
}

backgroundColorPicker.addEventListener('change', updateBackgroundColor);
function updateBackgroundColor() {
    backgroundColor = this.value;
    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach(item => {
        item.style.backgroundColor = backgroundColor;
    });
}

// Before painting, user selects the mode to work in 
colorBtn.addEventListener('click', () => setCurrentMode('single'));
rainbowBtn.addEventListener('click', () => setCurrentMode('rainbow'));
eraserBtn.addEventListener('click', () => setCurrentMode('eraser'));

function setCurrentMode(newMode) {
    activateButton(newMode);
    currentMode = newMode;
}

function activateButton(newMode) {
    if (currentMode === 'rainbow') {
        rainbowBtn.classList.remove('active');
    } else if (currentMode === 'single') {
        colorBtn.classList.remove('active');
    } else if (currentMode === 'eraser') {
        eraserBtn.classList.remove('active');
    }

    if (newMode === 'rainbow') {
        rainbowBtn.classList.add('active');
    } else if (newMode === 'single') {
        colorBtn.classList.add('active');
    } else if (newMode === 'eraser') {
        eraserBtn.classList.add('active');
    }
}

// Before painting, user customise grid to work on 
setupGrid(currentSize);
function setupGrid(size) {
    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    for (let i = 0; i < size * size; i++) {
        const gridElement = document.createElement('div');
        // To define each grid cell in order to apply selected bg-color to those elements with updateBackgroundColor()
        gridElement.setAttribute('class', 'grid-item');
        gridElement.classList.add('cell');
        gridElement.addEventListener('mouseover', changeColor);
        gridElement.addEventListener('mousedown', changeColor);
        grid.appendChild(gridElement);
    }
}

// Combine a global state (toggled on a mouseup/down event) with mouseover event to create desired effect where user "paints" by moving mouse onto grid and presses mouse button simultaneously

let mouseDown = false;
let body = document.querySelector('body');
body.addEventListener('mousedown', () => (mouseDown = true));
body.addEventListener('mouseup', () => (mouseDown = false));

function changeColor(e) {
    if (e.type === 'mouseover' && !mouseDown) return
    if (currentMode === 'rainbow') {
        const randomR = Math.floor(Math.random() * 256);
        const randomG = Math.floor(Math.random() * 256);
        const randomB = Math.floor(Math.random() * 256);
        e.target.style.backgroundColor = `rgb(${randomR},${randomG},${randomB})`;

        document.documentElement.style.setProperty('--rainbow-color', e.target.style.backgroundColor);

    } else if (currentMode === 'single') {e.target.style.backgroundColor = currentColor;
    } else if (currentMode === 'eraser') {
        e.target.style.backgroundColor = '#fefefe';
    }
}

sizeSlider.addEventListener('change', changeSizeValue);
function changeSizeValue(e) {
    setCurrentSize(e.target.value);
    resetGrid();
}
function setCurrentSize(newSize) {
    currentSize = newSize;
}

sizeSlider.addEventListener('mousemove', updateSizeValue);
function updateSizeValue(e) {
    sizeValue.innerHTML = `${e.target.value} x ${e.target.value}`;
}

clearBtn.addEventListener('click', resetGrid);
function resetGrid() {
    clearGrid();
    setupGrid(currentSize);
}
function clearGrid() {
    grid.innerHTML = "";
}
saveBtn.addEventListener('click', saveGrid);
function saveGrid () {
    domtoimage.toPng(grid)
        .then(function (dataUrl) {
            const img = new Image();
            img.src = dataUrl;
            document.body.appendChild(img);
        })
        .catch(function (error) {
            window.alert('oops, existential crysis', error);
        });
}