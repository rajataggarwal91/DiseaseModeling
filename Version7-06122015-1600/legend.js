/*========================================================================

Multipatch Epidemic Model for Spatial Spread of Vector-borne Diseases
legend.js:
-------------
Variables:
------------
legend: creates another group in svg named as legend.
color: defines colors as was defined for lineChart. Color scheme chosen in categorical.

------------
Functions:
-----------
draw_legend(): draws legend for the line Chart plot with color defining city and label beside it.

-------------------
Code Description:
-------------------
draw_legend just appends a legend group to svg and adds rectangles with filled in color corresponding to cities and their names beside it.


Code author     : Rajat Aggarwal
Arizona State University, Tempe

========================================================================
*/

function draw_legend(){
color = ["#1f77b4" ,"#ff7f0e" ,"#2ca02c" ,"#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf","#1f77b4"];

// add legend   
	var legend = svg.append("g")
	  .attr("class", "legend")
        //.attr("x", w - 65)
        //.attr("y", 50)
	  .attr("height", 100)
	  .attr("width", 100)
    .attr('transform', 'translate(500,50)')    
    
   //if there is already one present select, otherwise append rectangle with attributes defined below. At the start there is no rectangle present, so it enters those rectangles everytime on load. 
    legend.selectAll('rect')
      .data(time_Ih2)
      .enter()
      .append("rect")
	  .attr("x", 65)
      .attr("y", function(d, i){ return i *  20;})
	  .attr("width", 10)
	  .attr("height", 10)
	  .style("fill", function(d,i) { 
	  	   return color[i];
      })
    
    // Legend labels appended according to city name.
    legend.selectAll('text')
      .data(time_Ih2)
      .enter()
      .append("text")
	  .attr("x", 100)
      .attr("y", function(d, i){ return i *  20 + 9;})
	  .text(function(d,i) {
         return city[i];
      });

}