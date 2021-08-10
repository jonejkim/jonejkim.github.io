$(document).ready(function () {

    //==================================//
    // Append SVG
    //

    let svg = ((parent, height, width) => {
            return d3.select('#musicVis').append('svg').attr({
                'id' : "musicVisSvg",
                // simple solution for responsive SVG rendering
                'viewBox': "0 0 " + width + " " + height,
                'preserveAspectRatio': "xMidYMid meet"
                // 'width': width,
                // 'height': height,
            });
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

    // this is where the actual master volume is displayed
    let masterVol_visual = g_masterVol.append('rect')
        .classed('masterVol_visual', true)
        .datum(calculate_masterVol())
        .attr({
            'x': masterVolx,
            'y': masterVoly,
            'width': masterVolw,
            'height': masterVolh,
        })


    // invisible rectangle occupying entire quadrant used for mouse hover
    let masterVol_hover = g_masterVol.append('rect')
        .classed('masterVol_hover', true)
        .attr({
            'width': masterVolw,
            'height': masterVolh,
            'pointer-events': 'all',
            'fill' : 'none'
        })
        .on('mouseenter', makeMouseEnterFunc(g_masterVol, masterVolw, masterVolh, masterVol_hoverText))
        .on('mouseleave', makeMouseLeaveFunc(g_masterVol))



    //====[ masterWav ]====//

    // this is where the actual wave is displayed
    let masterWav_visual = g_masterWav.append('path')
        .classed('masterWav_visual', true)
        .datum(temporalData)
        .attr({
            'width': masterWavw,
            'height': masterWavh,
        })

    // invisible rectangle occupying entire quadrant used for mouse hover
    let masterWav_hover = g_masterWav.append('rect')
        .classed('masterWav_hover', true)
        .attr({
            'width': masterWavw,
            'height': masterWavh,
            'pointer-events': 'all',
            'fill' : 'none'
        })
        .on('mouseenter', makeMouseEnterFunc(g_masterWav, masterWavw, masterWavh, masterWav_hoverText))
        .on('mouseleave', makeMouseLeaveFunc(g_masterWav))



    //====[ decompVol ]====//

    // this is where the actual frequency spectrum is displayed
    let decompVol_visual = g_decompVol.selectAll('rect')
        .data(frequencyData)
        .enter()
        .append('rect')
        .classed('decompVol_visual', true)
        .attr({
            'x': (d) => {return decompVolw - (d/255)*decompVolw;},
            'y': (d, idx) => idx * decompVol_barh,
            'width': (d) => {return d;},
            'height': decompVol_barh,
        })

    // invisible rectangle occupying entire quadrant used for mouse hover event
    let decompVol_hover = g_decompVol.append('rect')
        .classed('decompVol_hover', true)
        .attr({
            'width': decompVolw,
            'height': decompVolh,
            'pointer-events': 'all',
            'fill' : 'none'
        })
        .on('mouseenter', makeMouseEnterFunc(g_decompVol, decompVolw, decompVolh, decompVol_hoverText))
        .on('mouseleave', makeMouseLeaveFunc(g_decompVol))


    //====[ Decomposed Sinewave ]====//

    let decompWav_visual = g_decompWav.selectAll('path')
        .data(Array.from({length: nNyq}, (elem) => temporalData ))
        .enter()
        .append('path')
        .classed('decompWav_visual', true)
        .attr({
            'x': 0,
            'y': (d, idx) => idx * decompWav_barh,
            'width': decompWavw,
            'height': decompWav_barh,
        })

    let decompWav_hover = g_decompWav.append('rect')
        .classed('decompWav_hover', true)
        .attr({
            'width': decompWavw,
            'height': decompWavh,
            'pointer-events': 'all',
            'fill' : 'none'
        })
        .on('mouseenter', makeMouseEnterFunc(g_decompWav, decompWavw, decompWavh, decompWav_hoverText))
        .on('mouseleave', makeMouseLeaveFunc(g_decompWav))


    //==================================//
    // Main - Realtime Rendering
    //

    function renderSvg() {
        requestAnimationFrame(renderSvg);

        analyser.getFloatTimeDomainData(temporalData)
        analyser.getByteFrequencyData(frequencyData);

        //====[ update masterVol ]====/
        let current_masterVol = calculate_masterVol()
        g_masterVol.select('.masterVol_visual , rect') // .select('rect')
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
        g_masterWav.select('.masterWav_visual, path') // .select('path')
            .datum(pairStaticx2ys(temporalData))
            .attr({
                'd' : masterWavLineFunc,
                'stroke': () => {
                    let color = String(uint8ColorMap(parseInt(current_masterVol)))
                    return 'rgb(' + color + ',' + color + ',' + color + ')'
                }
            })


        //====[ update decompVol ]====//
        g_decompVol.selectAll('.decompVol_visual, rect')
            .data(frequencyData)
            .attr({
                'x': (d) => {
                    // return 0
                    return decompVolw - (d/255)*decompVolw
                },
                'width': (d) => {
                    // return decompVolw
                    return (d/255)*decompVolw
                },
                'fill': (d) => {
                    let color = String(uint8ColorMap(parseInt(d)))
                    return 'rgb(' + color + ',' + color + ',' + color + ')'
                }
            })

            //====[ update decompWav ]====//
            g_decompWav.selectAll('.decompWav_visual, path')
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

    // window.addEventListener('keydown', (e) => {
    //     if (e.code === "Space") {
    //         let audioElem = document.getElementById('audioElem')
    //         if (audioElem.paused){
    //             audioElem.play()
    //         }else{
    //             audioElem.pause()
    //         }
    //     }
    // });

    $(document).on("mousedown", function(){
        // mitigation for chrome gesture warning "AudioContext was not allowed to start"
        audioCtx.resume();
    })

    audioFileInput.onchange = function(){
        var files = this.files;
        var file = URL.createObjectURL(files[0]);
        audioElem.src = file;

        audioSrc = audioCtx.createMediaElementSource(audioElem);
        analyser = audioCtx.createAnalyser();
        audioSrc.connect(analyser);
        audioSrc.connect(audioCtx.destination); //

        sampleMusicInfo.hidden = true


      };

});
