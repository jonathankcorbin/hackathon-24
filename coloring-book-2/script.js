let options = {
    // Tracing
    corsenabled : false,
    ltres : 1,
    qtres : 1,
    pathomit : 8,
    rightangleenhance : true,
    
    // Color quantization
    colorsampling : 2,
    numberofcolors : 4,
    mincolorratio : 0,
    colorquantcycles : 3,
    
    // Layering method
    layering : 0,
    
    // SVG rendering
    strokewidth : 1,
    linefilter : false,
    scale : 1,
    roundcoords : 1,
    viewbox : false,
    desc : false,
    lcpr : 0,
    qcpr : 0,
    
    // Blur
    blurradius : 0,
    blurdelta : 20
}

function toSVG(src) {
    ImageTracer.imageToSVG(

        src, /* input filename / URL */
        
        function(svgstr){ ImageTracer.appendSVGString( svgstr, 'svgcontainer' ) }, /* callback function to run on SVG string result */
        
        options /* Option preset */
        
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
    document.getElementById("mode").addEventListener('change', function() {
        options.numberofcolors = this.value;
    }, false);
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
        (function(capturedC) {
            child.addEventListener('click', function(){
                addColor(colors[capturedC]);
            });
        })(c);
        child.click();
        parent.appendChild(child);
    }
}

function makeOutline(svg) {
    let strokeWidth = 0.01 + height * 0.0001;
    let paths = svg.getElementsByTagName("path");
    for (let path of paths) {
        path.setAttribute("tag", path.getAttribute("fill"));
        path.setAttribute("fill", "white");
        path.setAttribute("stroke", "black");
        path.setAttribute("stroke-width", strokeWidth);
    }
}

function addColor(color) {
    console.log(color);
    let svg = document.getElementById("svgcontainer").childNodes[0];
    let paths = svg.getElementsByTagName("path");
    for (let path of paths) {
        if (path.getAttribute('tag') == color) {
            path.setAttribute("fill", color);
        }
    }
}