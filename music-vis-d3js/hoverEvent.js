

function makeMouseEnterFunc(g_quadrant, quadrantw, quadranth, hoverText){

    function mouseenter(){
        if ( !$('.hoverOverlay')[0] ){
            g_quadrant.attr({'pointer-events' : 'none'})
            g_quadrant.append('rect')
                .classed('hoverOverlay', true)
                .attr({
                    'width': quadrantw,
                    'height': quadranth,
                    'fill' : 'rgba(0,0,0,0.5)'
                })
            g_quadrant.append('text')
            .classed('hoverOverlayText', true)
            .text(hoverText).call(wrapText, quadrantw, quadranth)
        }
    }
    return mouseenter
}

function makeMouseLeaveFunc(g_quadrant){

    function mouseleave(){
        if ( $('.hoverOverlay')[0] ){
            g_quadrant.attr({'pointer-events' : 'all'})
            g_quadrant.selectAll('.hoverOverlay, .hoverOverlayText').remove()
        }
    }
    return mouseleave
}

// modified text wrapping function from:
// - https://stackoverflow.com/a/41435258
function wrapText(text, quadrantw, quadranth) {
    text.each(function() {

        //----[ text wrapping ]----//

        let text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");

        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));

            // use <br> as a special word to induce custom line breaks
            if (word == '<br>'){
                line.pop();
                tspan.text(line.join(" "));
                line = [''];
                tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", lineHeight + "em").text(word);
                lineNumber++
                continue
            }

            // actual text wrapping
            if (tspan.node().getComputedTextLength() > quadrantw) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", lineHeight + "em").text(word);
                lineNumber++
                continue
            }
        }

        //----[ place text in the center of quadrant ]----//

        // line height compensation pixel value
        // as with the original code the text position gets shifted downards as more lines are wrapped
        let textHeightPxCompensator = lineNumber*lineHeight*em2pxRatio

        text.attr({
            'transform' : 'translate(' + quadrantw/2 + ', ' + (quadranth - textHeightPxCompensator)/2 + ')'
        })

    });
  }
