/*========================================================================

Multipatch Epidemic Model for Spatial Spread of Vector-borne Diseases
RhlineChart.js:
-------------
Variables:
------------
svg4: The svg container for displaying recovered humans vs time line chart. 

------------
Functions:
-----------
RhlineChart(): draws the plot using d3 library functions. calls AfricaMapInit(), AfricaMap() and calc_execTime() once after lineChart completed its execution

-------------------
Code Description:
------------------
The function lineChart contains a standard line Chart d3 implementation, used from: http://bl.ocks.org/mbostock/3883245
The values on y axis are Recovered Humans(Rh) and x axis plots time values(t)
These values were calculated and stored in global variables in calculate.js
Time_Ih2 stores theses values in object format that path attribute of svg requires in its datum attribute.
====================================
Code author     : Rajat Aggarwal
Arizona State University, Tempe
====================================
========================================================================
*/


var svg4;

function RhlineChart(){

margin = {top: 10, right: 20, bottom: 30, left: 60},
width =screen.width/(4.3) - margin.left - margin.right,
height = screen.height/5 - margin.top - margin.bottom;

//If the plot is recreated, remove the previous one. Not necessary if there is no interactivity
if (d3.select("#LineChart4")!=null){
d3.select("#LineChart4").selectAll("*").remove();
}

//svg is scalar vector graphics. It defines a way to draw graphics on HTML pages
svg4 = d3.select('#LineChart4').append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//supports upto 10 different colored graph
var colors = color = d3.scale.category10();



//Creating axis according to 1st city for now, but ideally all should have similar range of time values.
//Important thing to note is that differential equation solver calculates value of y at different time intervals for different cities.
//Still the plot comes out to be correct when laid out on the same graph.

//Defines the scale mapping from time to coordinates in x, and maxInfectedHumans to svg coordinates in y axis. 
var x = d3.scale.linear()
	.domain([0,xlimit])
    .range([0, width]);


var y = d3.scale.linear()
   	.range([height, 0])
   	.domain([0,maxRecoveredHumans]);


// d3 defines these functions to create axis, with some standard attributes to manipulate its properties and position.
var xAxis = d3.svg.axis()
    .scale(x)
    .ticks(10)
    .orient("bottom");

	
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");



for(c=0;c<NumOfCities;c++){

  t[c]=time_h[c][0];
  RecoveredHumans[c]=time_h[c][1];
  
  
  //Defines where the x and y coordinates of lines should be placed at
  var line = d3.svg.line()
    .x(function(d,i) {   return x(d.t); })
    .y(function(d,i) {   return y(d.RecoveredHumans); });

   //Adding labels to axes
 svg4.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
	 .append("text")
      .attr("x", width)
      .attr("dy", "1em")
      .style("text-anchor", "end")
      .text("Years");
	  

  svg4.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Rh");

//Creating the line stroke on values of Rh vs Time.
  svg4.append("path")
      .datum(time_h2[c])
      .attr("class", "line")
      .attr("d", line)
      .style("stroke",colors(c));
}


}
