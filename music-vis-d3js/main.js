$(document).ready(function () {

    //==================================//
    // Append SVG
    //

    let svg = ((parent, height, width) => {
            return d3.select('#musicVis').append('svg').attr({
                'width': width,
                'height': height});
        })('body', svgh, svgw)

    //====[ Append SVG Subgroup Elements ]====//

    let g_masterVol = svg.append('g').attr({
        'transform': 'translate(' + masterVolx + ', ' + masterVoly + ')',
        'width' : masterVolw,
        'height' : masterVolh,
    })

    let g_masterWav = svg.append('g').attr({
        'transform': 'translate(' + masterWavx + ', ' + masterWavy + ')',
        'width' : masterWavw,
        'height' : masterWavh,
    })

    let g_decompVol = svg.append('g').attr({
        'transform': 'translate(' + decompVolx + ', ' + decompVoly + ')',
        'width' : decompVolw,
        'height' : decompVolh,
    })

    let g_decompWav = svg.append('g').attr({
        'transform': 'translate(' + decompWavx + ', ' + decompWavy + ')',
        'width' : decompWavw,
        'height' : decompWavh,
    })



    //==================================//
    // Fill in Initial Data
    //

    //====[ masterVol ]====//

    g_masterVol.append('rect')
        .classed('masterVol', true)
        .datum(calculate_masterVol())
        .attr({
            'x': masterVolx,
            'width': masterVolw,
            'y': masterVoly,
            'height': masterVolh,
            'fill' : 'none'
        })

    //====[ masterWav ]====//

    g_masterWav.append('path')
        .datum(temporalData)
        .classed('masterWav', true)
        .attr({
            'x': 0,
            'width': masterWavw,
            'y': 0,
            'height': masterWavh,
        })


    //====[ decompVol ]====//

    g_decompVol.selectAll('rect')
        .data(frequencyData)
        .enter()
        .append('rect')
        .classed('decompVol', true)
        .attr({
            'x': (d) => {return decompVolw - (d/255)*decompVolw;},
            'width': (d) => {return d;},
            'y': (d, idx) => idx * decompVol_barh,
            'height': decompVol_barh,
        })

    //====[ Decomposed Sinewave ]====//

    g_decompWav.selectAll('path')
        .data(Array.from({length: nNyq}, (elem) => temporalData ))
        .enter()
        .append('path')
        .classed('decompWav', true)
        .attr({
            'x': 0,
            'width': decompWavw,
            'y': (d, idx) => idx * decompWav_barh,
            'height': decompWav_barh,
        })


    //==================================//
    // Main - Realtime Rendering
    //

    function renderSvg() {
        requestAnimationFrame(renderSvg);

        analyser.getFloatTimeDomainData(temporalData)
        analyser.getByteFrequencyData(frequencyData);


        //====[ update masterVol ]====/
        let current_masterVol = calculate_masterVol()
        g_masterVol.select('rect')
            .datum(current_masterVol)
            .attr({
                'x': (d) => {
                    return 0
                    // return masterVolw - (d/255)*masterVolw
                },
                'width': (d) => {
                    return masterVolw
                    // return (d/255)*masterVolw
                },
                'fill': (d) => {
                    let color = String(uint8ColorMap(d))
                    return 'rgb(' + color + ',' + color + ',' + color + ')'
                }
            })


        //====[ update masterWav ]====//
        g_masterWav.select('path')
            .datum(pairStaticx2ys(temporalData))
            .attr({
                'd' : masterWavLineFunc,
                'stroke': () => {
                    let color = String(uint8ColorMap(parseInt(current_masterVol)))
                    return 'rgb(' + color + ',' + color + ',' + color + ')'
                }
            })


        //====[ update decompVol ]====//
        g_decompVol.selectAll('rect')
            .data(frequencyData)
            // d 패러미터는 각 data의 값인듯
            .attr({
                'x': (d) => {
                    return 0
                    // return decompVolw - (d/255)*decompVolw
                },
                'width': (d) => {
                    return decompVolw
                    // return (d/255)*decompVolw
                },
                'fill': (d) => {
                    let color = String(uint8ColorMap(parseInt(d)))
                    return 'rgb(' + color + ',' + color + ',' + color + ')'
                }
            })

        //====[ update decompWav ]====//
        g_decompWav.selectAll('path')
            .data(get_decompWavxys())
            .attr( {
                'd' : (d, frqBin) => decompWavLineFuncs[frqBin](d),
                // 'stroke' : 'rgb(255,255,255)'
                'stroke': (d, frqBin) => {
                    let color = String(uint8ColorMap(parseInt(frequencyData[frqBin])))
                    return 'rgb(' + color + ',' + color + ',' + color + ')'
                }

            })
    }
    renderSvg();

    window.addEventListener('keydown', (e) => {
        if (e.code === "Space") {
            let audioElem = document.getElementById('audioElem')
            if (audioElem.paused){
                audioElem.play()
            }else{
                audioElem.pause()
            }
        }
    });

});
