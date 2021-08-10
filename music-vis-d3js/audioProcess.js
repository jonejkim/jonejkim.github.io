//==================================//
// Start Audio Context/Analyzer
//

let audioCtx = new (window.webkitAudioContext || window.AudioContext)();

let analyser = audioCtx.createAnalyser();
analyser.fftSize = nFFT
// analyser.minDecibels = minDecibels
// analyser.maxDecibels = maxDecibels

let audioSrc = audioCtx.createMediaElementSource(audioElem);

audioSrc.connect(analyser);
audioSrc.connect(audioCtx.destination); //

let temporalData = new Float32Array(analyser.fftSize);          // size of nFFT
let frequencyData = new Uint8Array(analyser.frequencyBinCount); // size of nFFT/2

let fSmp = audioCtx.sampleRate

//==================================//
// arrays to fetch audio data
//


//==================================//
// Create d3 Axes
//

//----[ static time domain x axis ]----//

const staticNormXs = d3.range(0,nFFT).map((idx) => idx/nFFT )

function pairxys (xs, ys) {
    return xs.map((x, idx) => {return [ x , ys[idx] ]})
}
function pairStaticx2ys(ys) {
    return pairxys(staticNormXs, ys)
}

//----[ masterWav d3 scale ]----//
const masterWavLineFunc = d3.svg.line()
    .x(function(d) {
        return d3.scale.linear()
            .domain(d3.extent(staticNormXs))
            .range([0, masterWavw])(d[0]);
    })
    .y(function(d) {
        return d3.scale.linear()
            .domain([-1, 1])
            .range([0, masterWavh])(d[1]);
    }).interpolate('basis');

//----[ decompWav d3 scales ]----//

const decompWavLineFuncs = Array.from({length: nDecomp} , (dummy, frqBin) =>

    d3.svg.line()
        .x(function(d) {
            return d3.scale.linear()
                .domain(d3.extent(staticNormXs))
                .range([0, decompWavw])(d[0]);
        })
        .y(function(d) {
            return d3.scale.linear()
                .domain([-1.0, 1.0])
                .range([frqBin*decompWav_barh, frqBin*decompWav_barh+decompWav_barh])(d[1]);
        }).interpolate('basis')
)

//==================================//
// Calculations for Each Group
//

//----[ calculations for masterVol ]----//
function calculate_masterVol() {
    // sum of all frequency component magnitudes
    return d3.range(0, nNyq).reduce((accm,idx) => accm + frequencyData[idx]) / nNyq
}

//----[ calculations for masterWav ]----//

// - just need to directly use temporalData

//----[ calculations for masterVol ]----//

// - just need to directly use frequencyData

//----[ calculations for decompWav ]----//

function getLFO (frqBin) {
    // Low Frequency Oscillator for standing wave effect
    let ctxTime = audioCtx.getOutputTimestamp().contextTime
    let LFOPeriodSec = 1/(frqBin*LFOSpeedFactor)
    let frqNorm = (ctxTime % LFOPeriodSec) / LFOPeriodSec
    return Math.cos(2*Math.PI*frqNorm)
}

function frqMag2wav (frqMag, frqBin) {
    // construct an oscillating wave component as function of each frequency value
    frqMag = (frqMag / 255) // need uint8 conversion for now
    let frqNorm = frqBin/nFFT

    let lfoVal = getLFO(frqBin)

    cos = ((frqVal, frqNorm) => {
        return fftWindowIdxs.map((tIdx) => lfoVal* frqVal * -Math.cos(2*Math.PI*frqNorm*tIdx + cosinePhaseShift))
    })(frqMag, frqNorm)

    return cos
}

function get_decompWavxys () {
    return Array.from({length: nDecomp}, (xxx,frqBin) => {
        return pairStaticx2ys(frqMag2wav(frequencyData[frqBin+skipDCBin], frqBin+skipDCBin))
    })
}

//==================================//
// Misc
//
function uint8ColorMap (val) {
    // return val
    return 255 - val
}

