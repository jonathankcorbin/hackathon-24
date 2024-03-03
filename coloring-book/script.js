function toSVG(src) {
    ImageTracer.imageToSVG(

        src, /* input filename / URL */
        
        function(svgstr){ ImageTracer.appendSVGString( svgstr, 'svgcontainer' ) }, /* callback function to run on SVG string result */
        
        'posterized2' /* Option preset */
        
    );
}

document.addEventListener("DOMContentLoaded", (event) => {
    document.getElementById('fileInput').addEventListener('change', function(event) {
        document.getElementById("svgcontainer").innerHTML = "";
        let file = event.target.files[0]; // Get the uploaded file
        if (file) {
            let reader = new FileReader(); // Create a FileReader object
            reader.onload = function() {
                let src = reader.result; // Get the data URL of the uploaded file
                toSVG(src); // Call the toSVG function with the uploaded file's data URL
            };
            reader.readAsDataURL(file); // Read the uploaded file as a data URL
        }
        sizing();
    });
});

let intervalID = 0;

function sizing(){
    const interval = () => {
        if (document.getElementById("svgcontainer").childNodes.length) {
            let svg = document.getElementById("svgcontainer").childNodes[0]
            fillPage(svg);
            color(svg);
            clearInterval(intervalID);
        }
    };
    intervalID = setInterval(interval, 10);
    interval();
}

let height = 0;
let width = 0;

function fillPage(svgElement) {
    height = svgElement.getAttribute("height");
    width = svgElement.getAttribute("width");

    svgElement.setAttribute("height", "");
    svgElement.setAttribute("width", "");

    svgElement.setAttribute("viewBox", "0 0 " + width + " " + height);
}

function color(svg) {
    let colors = []
    let paths = svg.getElementsByTagName("path");
    for (let path of paths) {
        let fillColor = path.getAttribute("fill")
        if (!colors.includes(fillColor)) {
            colors.push(fillColor);
        }
    }
    makeOutline(svg);
    displayButtons(colors);
}

function displayButtons(colors) {
    let parent = document.getElementById("buttons");
    parent.innerHTML = "";
    for (c in colors) {
        let child = document.createElement("button");
        child.id = c;
        child.textContent = colors[c];
        parent.appendChild(child);
    }
    addButton();
}

function makeOutline(svg) {
    let strokeWidth = 0.1 + height * 0.001;
    let paths = svg.getElementsByTagName("path");
    for (let path of paths) {
        path.setAttribute("tag", path.getAttribute("fill"));
        path.setAttribute("fill", "white");
        path.setAttribute("stroke", "black");
        path.setAttribute("stroke-width", strokeWidth);
    }
}

function addButton() {
    let button = document.getElementById("1");
    button.addEventListener("click", testClick)
}

function testClick() {
    addColor();
}

function addColor() {
    let svg = document.getElementById("svgcontainer").childNodes[0];
    let paths = svg.getElementsByTagName("path");
    for (let path of paths) {
        if (path.getAttribute('tag') == "rgb(78,79,109)") {
            path.setAttribute("fill", "rgb(78, 79, 109)");
        }
    }
}