/*========================================================================

Multipatch Epidemic Model for Spatial Spread of Vector-borne Diseases
TempLineChart.js:
-------------
Variables:
------------
Tempsvg: The svg container for displaying temperature linechart
xlimit : 11 (this should be 12 and should start from 1 instead of 0, and this needs to be corrected)
------------
Functions:
-----------
TempLineChart(): draws the plot using d3 library functions. calls drawlegend() and calc_execTime() once after lineChart completed its execution

-------------------
Code Description:
------------------
The function TempLineChart contains a standard line Chart d3 implementation, used from: http://bl.ocks.org/mbostock/3883245
The values on y axis are Temperatures(in degrees C) and x axis plots time values( in months)
These values are obtained from : http://data.worldbank.org/data-catalog/cckp_historical_data

========================================================================
Code author     : Rajat Aggarwal
Arizona State University, Tempe
========================================================================

========================================================================
*/


var Tempsvg;

function TempLineChart(){

margin = {top: 20, right: 20, bottom: 30, left: 50},
width =screen.width/(4.2) - margin.left - margin.right,
height = screen.height/4.2 - margin.top - margin.bottom;

//If the plot is recreated, remove the previous one. Not necessary if there is no interactivity
if (d3.select("#TempLineChart")!=null){
d3.select("#TempLineChart").selectAll("*").remove();
}

//svg is scalar vector graphics. It defines a way to draw graphics on HTML pages
Tempsvg = d3.select('#TempLineChart').append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//supports upto 11 different colored graph
//var colors = ["#1f77b4" ,"#ff7f0e" ,"#2ca02c" ,"#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf","#1f77b4"];
var colors = color = d3.scale.category10();
var xlimit = 11;


//time_Ih contains the key value pair of Ih and time.




//Creating axis according to 1st city for now, but ideally all should have similar range of time values.
//Important thing to note is that differential equation solver calculates value of y at different time intervals for different cities.
//Still the plot comes out to be correct when laid out on the same graph.

//Defines the scale mapping from time to coordinates in x, and maxInfectedHumans to svg coordinates in y axis. 
var x = d3.scale.linear()
	.domain([0,xlimit])
    .range([0, width]);


var y = d3.scale.linear()
   	.range([height, 0])
   	.domain([0,45]);


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
  InfectedHumans[c]=time_h[c][1];
  
  
  //Defines where the x and y coordinates of lines should be placed at
  var line = d3.svg.line()
    .x(function(d,i) {   return x(i); })
    .y(function(d,i) {   
      return y(CountriesTemperature[CountriesTempCode.indexOf(city[c])][(i+1)]); });

   //Adding labels to axes
 Tempsvg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
	 .append("text")
      .attr("x", width)
      .attr("dy", "1em")
      .style("text-anchor", "end")
      .text("Months");
	  

  Tempsvg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("C");

//Creating the line stroke on values of Ih vs Time.
  Tempsvg.append("path")
      .datum(time_h2[c])
      .attr("class", "line")
      .attr("d", line)
      .style("stroke",colors(c));
}


}
