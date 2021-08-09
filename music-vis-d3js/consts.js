//==================================//
// Audio Analyzer Configs
//
const nFFT = 128
const nNyq = nFFT/2

const nDecomp = 32  // how many frequencies decomposed to actually plot.
                    // should be smaller or equal to nNyq

const nNyqDecomp_ratio = nNyq / nDecomp // used for compensating for omitted frequency bins.

const fftWindowIdxs = [...Array(nFFT).keys()];

const minDecibels = -70
const maxDecibels = -10


//==================================//
// SVG
//
const svgh = 1000;
const svgw = 1200;

//==================================//
// SVG Subgroup Outline
//

//====[ masterVol - top left quadrant ]====//
// rest of the other quadrants soley depend on this quadrant.
const masterVolx = 0
const masterVoly = 0
const masterVolw = 0.05*svgw
const masterVolh = 0.15*svgh

//====[ masterWav - top right quadrant ]====//
const masterWavx = masterVolx + masterVolw
const masterWavy = 0
const masterWavw = svgw - masterVolw
const masterWavh = masterVolh

//====[ decompVol - bottom left quadrant ]====//
const decompVolx = 0
const decompVoly = masterVoly + masterVolh
const decompVolw = masterVolw
const decompVolh = svgh - masterVolh

//====[ decompWav - bottom right quadrant ]====//
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




