/*========================================================================

Multipatch Epidemic Model for Spatial Spread of Vector-borne Diseases
EhlineChart.js:
-------------
Variables:
------------
svg : The svg container for displaying Exposed Humans vs time graph

------------
Functions:
-----------
EhlineChart(): draws the plot using d3 library functions. 

-------------------
Code Description:
------------------
The function EhlineChart contains a standard line Chart d3 implementation, used from: http://bl.ocks.org/mbostock/3883245
The values on y axis are Exposed Humans(Eh) and x axis plots time values(t)
These values were calculated and stored in global variables in calculate.js
Time_Ih2 stores theses values in object format that path attribute of svg requires in its datum attribute.

====================================
Code author     : Rajat Aggarwal
Arizona State University, Tempe
====================================
========================================================================
*/




function EhlineChart(){

margin = {top: 10, right: 20, bottom: 30, left: 60},
width =screen.width/(4.3) - margin.left - margin.right,
height = screen.height/5 - margin.top - margin.bottom;

//If the plot is recreated, remove the previous one. Not necessary if there is no interactivity
if (d3.select("#LineChart3")!=null){
d3.select("#LineChart3").selectAll("*").remove();
}

//svg is scalar vector graphics. It defines a way to draw graphics on HTML pages
var svg = d3.select('#LineChart3').append("svg")
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
   	.domain([0,maxExposedHumans]);


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
  ExposedHumans[c]=time_h[c][3];
  
  
  //Defines where the x and y coordinates of lines should be placed at
  var line = d3.svg.line()
    .x(function(d,i) {   return x(d.t); })
    .y(function(d,i) {   return y(d.ExposedHumans); });

   //Adding labels to axes
 svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
	 .append("text")
      .attr("x", width)
      .attr("dy", "1em")
      .style("text-anchor", "end")
      .text("Years");
	  

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Eh");

//Creating the line stroke on values of Eh vs Time.
  svg.append("path")
      .datum(time_h2[c])
      .attr("class", "line")
      .attr("d", line)
      .style("stroke",colors(c));
}



}
