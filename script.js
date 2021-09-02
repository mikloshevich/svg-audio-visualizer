const body = document.querySelector('body');
const svg = document.querySelector('svg');

const ctx = new AudioContext();
const analyser = ctx.createAnalyser();

const num = 128;
const width = 0.2;

for (let i = 0; i < num; i++) {
    bar = document.createElementNS("http://www.w3.org/2000/svg", "line");
    bar.setAttribute('class', 'bar');
    // bar.setAttribute('x1', i *5);
    bar.setAttribute('x1', (i * 1.3) + '%');
    bar.setAttribute('y1', '0');
    // bar.setAttribute('x2', i *5);
    bar.setAttribute('x2', (i * 1.3) + '%');
    bar.setAttribute('y2', '80' + '%');
    bar.setAttribute("stroke-width", `${width*5}%`);
    bar.setAttribute("stroke", "white");
    svg.appendChild(bar);
}

let bars = document.getElementsByClassName('bar');
// console.log(bars);

setupContext();
drawVisualizer();

async function setupContext() {
    const input = await getInput()
    if(ctx.state === 'suspended'){
        await ctx.resume()
    }
    // console.log(ctx.state)
    const src = ctx.createMediaStreamSource(input)
    src.connect(analyser)
}

function getInput() {
    return navigator.mediaDevices.getUserMedia({
        audio: {
            echoCancelation: false,
            autoGainControl: false,
            noiseSuppresion: false,
            latency: 0
        }
    })
}

function drawVisualizer() {
    requestAnimationFrame(drawVisualizer)

    const array = new Uint8Array(num)
    analyser.getByteFrequencyData(array)
    // console.log(array)

    for(let i = 0; i < num; i++) {
        barHeight = array[i];
        bars[i].style.transform = 'scaleY('+ barHeight / 200 + ')';
        bars[i].setAttribute("stroke", 'hsl('+ barHeight * 2.6 +', 100%, 50%)');
        bars[i].style.opacity = 0.01 * barHeight;
    }
}