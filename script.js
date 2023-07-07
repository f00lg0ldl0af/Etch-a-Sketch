/*import domtoimage from 'dom-to-image';*/

/* Because your script/JS file isn't a module type, the syntax import will not work. I won't go into detail since you'll learn about them later, but for now, just use their cdn
Also, you're already using npm this early? */
/* I would ignore the npm stuff for now, but yes npm is a package manager so you can use pieces of code created by other developers in your own code.

These libraries, if they have it, also hosts it in the cloud (the internet) so you can inject their code in your application easily without needing to download anything, it's a plug and play kinda thing (this assumes internet connection, while packages from npm does not assuming you've already installed the package) */

const DEFAULT_COLOR = '#333';
const DEFAULT_MODE = 'single';
const DEFAULT_SIZE = 16;

let currentColor = DEFAULT_COLOR;
let currentMode = DEFAULT_MODE;
let currentSize = DEFAULT_SIZE;

const colorPicker = document.getElementById('colorPicker');
const colorBtn = document.getElementById('colorBtn');
const rainbowBtn = document.getElementById('rainbowBtn');
const eraserBtn = document.getElementById('eraserBtn');
const clearBtn = document.getElementById('clearBtn');
const saveBtn = document.getElementById('saveBtn');
const sizeValue = document.getElementById('sizeValue');
const sizeSlider = document.getElementById('sizeSlider');
const grid = document.getElementById('grid');
const backgroundColorPicker = document.querySelector(`.background-setting input[type="color"]`);

function setCurrentColor(e) {
    currentColor = e.target.value;
}

function setCurrentMode(newMode) {
    activateButton(newMode);
    currentMode = newMode;
}

function setCurrentSize(newSize) {
    currentSize = newSize;
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

function updateBackgroundColor() {
    backgroundColor = this.value;

    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach(item => {
        item.style.backgroundColor = backgroundColor;
    });
  }

colorPicker.addEventListener('input', setCurrentColor);
backgroundColorPicker.addEventListener('change', updateBackgroundColor);

colorBtn.addEventListener('click', () => setCurrentMode('single'));
rainbowBtn.addEventListener('click', () => setCurrentMode('rainbow'));
eraserBtn.addEventListener('click', () => setCurrentMode('eraser'));
/*Why does it need to be () => function? If i leave it as ('click', function(arg)), active is permanently applied to eraserBtn*/

clearBtn.addEventListener('click', resetGrid);
saveBtn.addEventListener('click', saveGrid);
sizeSlider.addEventListener('mousemove', updateSizeValue);
sizeSlider.addEventListener('change', changeSizeValue);

let mouseDown = false;
let body = document.querySelector('body');
body.addEventListener('mousedown', () => (mouseDown = true));
body.addEventListener('mouseup', () => (mouseDown = false));

function changeSizeValue(e) {
    setCurrentSize(e.target.value);
    resetGrid();
}

function updateSizeValue(e) {
    sizeValue.innerHTML = `${e.target.value} x ${e.target.value}`;
}

setupGrid(currentSize);

function resetGrid() {
    clearGrid();
    setupGrid(currentSize);
}


function clearGrid() {
    grid.innerHTML = "";
}

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

/* TOP Guidance: Right yeah, I think the drag effect is a bit more complicated then just setting callbacks to event listeners. This is something you'll want to Google :).

I'm pretty sure there isn't a native "drag" mouse event, so you'll likely need to set some global state that is toggled on a mousedown/up event, that will combine with a mouseover event to create the desired effect.*/

function setupGrid(size) {
    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    for (let i = 0; i < size * size; i++) {
        const gridElement = document.createElement('div');
        gridElement.setAttribute('class', 'grid-item'); /*setAttribute() method sets the value of an attribute on a specified element*/
        gridElement.classList.add('cell');
        gridElement.addEventListener('mouseover', changeColor);
        gridElement.addEventListener('mousedown', changeColor);
        grid.appendChild(gridElement);
    }
}

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


