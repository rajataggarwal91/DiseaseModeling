/*========================================================================

Multipatch Epidemic Model for Spatial Spread of Vector-borne Diseases
legend.js:
-------------
Variables:
------------
ChartLegend: creates another group in svg named as legend.
color: defines colors as was defined for lineChart. Color scheme chosen in categorical.

------------
Functions:
-----------
draw_legend(): draws legend for the line Chart plot with color defining city and label beside it.

-------------------
Code Description:
-------------------
draw_legend just appends a legend group to svg and adds rectangles with filled in color corresponding to cities and their names beside it.


========================================================================
Code author     : Rajat Aggarwal
Arizona State University, Tempe
========================================================================
========================================================================
*/

function draw_legend(){
color = d3.scale.category10();
// add legend   
	var ChartLegend = d3.select("#LegendDiv").append("svg").append("g")
	 .attr("class", "legend2")
        //.attr("x", w - 65)
        //.attr("y", 50)
	  .attr("height", 100)
	  .attr("width", 100);
   
    
   //if there is already one present select, otherwise append rectangle with attributes defined below. At the start there is no rectangle present, so it enters those rectangles everytime on load. 
    ChartLegend.selectAll('rect')
      .data(time_h2)
      .enter()
      .append("rect")
	  .attr("x", 65)
      .attr("y", function(d, i){ return i *  20;})
	  .attr("width", 50)
	  .attr("height", 5)
	  .style("fill", function(d,i) { 
	  	   return color(i);
      })
    
    // Legend labels appended according to city name.
    ChartLegend.selectAll('text')
      .data(time_h2)
      .enter()
      .append("text")
	  .attr("x", 150)
      .attr("y", function(d, i){ return i *  20 + 9;})
	  .text(function(d,i) {
         return city[i];
      });

}