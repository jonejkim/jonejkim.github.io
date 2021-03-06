//==================================//
// Audio Analyzer Configs
//

// many of significant parameters can be adjusted here
const nFFT = 128        // number of values to be used in the window of Fast Fourier Transform
const nNyq = nFFT/2     // number of nyquist bins is half of FFT window

const nDecomp = 15  // how many frequencies decomposed to actually plot.
                    // should be smaller or equal to nNyq

const fftWindowIdxs = [...Array(nFFT).keys()];

// default values known for the web audio API
// const minDecibels = -100
// const maxDecibels = 0

// whether to omit first frequency bin (DC offset) or not.
const omitDCFrqBin = true
const skipDCBin = omitDCFrqBin? 1 : 0

const useCosinePhaseShift = true
const cosinePhaseShift = useCosinePhaseShift? (Math.PI/2) : 0

// how much to speed up on LFO oscillation
// 0 eliminates LFO effect
const LFOSpeedFactor = 2.0

// used for quadrant hover text wrapping. calculation for line height compensation
const em2pxRatio = 17.6 // assuming body 16px for now - https://www.w3schools.com/tags/ref_pxtoemconversion.asp

//==================================//
// SVG
//
const svgw = document.getElementById("outermost").clientWidth
const svgh = document.getElementById("outermost").clientWidth
// const svgw = 1000*0.75;
// const svgh = 1000*0.75;

//==================================//
// SVG Subgroup Outline
//

//====[ masterVol - top left quadrant ]====//

// rest of the other quadrants soley depend on this quadrant.

const masterVol_hoverText = "Total Volume <br> (sum of signal values in DFT window)"
// ["Total Volume", "(sum of signal values in DFT window)"]

const masterVolx = 0
const masterVoly = 0
const masterVolw = 0.5*svgw
const masterVolh = 0.5*svgh


//====[ masterWav - top right quadrant ]====//

const masterWav_hoverText = "Time Domain Waveform <br> (ie. original music signal)"
 // ["Time Domain Waveform", "(ie. original signal)"]

const masterWavx = masterVolx + masterVolw
const masterWavy = 0
const masterWavw = svgw - masterVolw
const masterWavh = masterVolh


//====[ decompVol - bottom left quadrant ]====//

const decompVol_hoverText = "Decomposed Frequency Domain Spectrum <br> (ie. the DFT result)"
// ["Decomposed Frequency Domain Spectrum", "(DFT result)"]

const decompVolx = 0
const decompVoly = masterVoly + masterVolh
const decompVolw = masterVolw
const decompVolh = svgh - masterVolh


//====[ decompWav - bottom right quadrant ]====//

const decompWav_hoverText = "Decomposed Time Domain Waveform <br> (ie. reconstructed sinusoidals)"
// ["Decomposed Time Domain Waveform", "(ie. reconstructed)"]

const decompWavx = masterVolw
const decompWavy = masterVolh
const decompWavw = svgw - masterVolw
const decompWavh = svgh - masterVolh



//==================================//
// SVG Subgroups Internal Configs
//

//====[ masterVol - top left quadrant ]====//

//====[ masterWav - top right quadrant ]====//

//====[ decompVol - bottom left quadrant ]====//
// const decompVol_barInterGap = 3;
const decompVol_barh = decompVolh / nDecomp

//====[ decompWav - bottom right quadrant ]====//
const decompWav_barh = decompWavh / nDecomp




