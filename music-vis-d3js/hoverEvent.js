

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
                .text(hoverText)
                .attr({
                    'transform' : 'translate(' + quadrantw/2 + ', ' + quadranth/2 + ')',
                }).call(wrapText, quadrantw)
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

// text wrapping function from : https://stackoverflow.com/a/41435258
function wrapText(text, width) {
    text.each(function() {
      var text = d3.select(this),
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
        if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", lineHeight + "em").text(word);
        }
      }
    });
  }
