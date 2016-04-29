/*========================================================================

Multipatch Epidemic Model for Spatial Spread of Vector-borne Diseases
IhlineChart.js:
-------------
Variables:
------------
svg: The svg container for displaying InfectedHumans vs time graph
time_h2: similar to time_h, but in object form (t:x,InfectedHumans:a,SusceptibleHumans:b, ExposedHumans:c, RecoveredHumans:d). This is necessary for providing data to svg path element
margin: defined margin for svg
xlimit: defines the time limit. It is considered that the time period of all the cities is same if Runge Kutta iteration count is high enough. So first city is considered to calculate maximum x axis value.
maxInfectedHumans: maximum of all cities' Infected Humans, used to find maximum value of plot on y axis.

------------
Functions:
-----------
intializeTimeh2() : intializes time_h2 object variable in key:value pair fashion for input as "data" to linechart. Also calculate maximum of each category.
IhlineChart(): draws the plot using d3 library functions.
-------------------
Code Description:
------------------
The function IhlineChart contains a standard line Chart d3 implementation, used from: http://bl.ocks.org/mbostock/3883245
The values on y axis are Infected Humans([Ih,Sh,Eh,Rh]) and x axis plots time values(t)
These values were calculated and stored in global variables in calculate.js
time_h2 stores theses values in object format that path attribute of svg requires in its datum attribute.

====================================
Code author     : Rajat Aggarwal
Arizona State University, Tempe
====================================
========================================================================
*/

var  time_h2=[];
function initializeTimeh2(){
//time_h contains the key value pair of [Ih,Sh,Eh,Rh] and time.
//Create time_h2 array which contains values in key:value form
  for(var c=0;c<NumOfCities;c++){
    time_h2[c]=[];
    for(var i=0;i<time_h[c][0].length;i++){
      time_h2[c][i] = {t:time_h[c][0][i],InfectedHumans:time_h[c][1][i],SusceptibleHumans:time_h[c][2][i],ExposedHumans:time_h[c][3][i],RecoveredHumans:time_h[c][4][i]};
    }
  }

//Compute max of Infected,Susceptible,Exposed and Recovered humans. This is used to find range on y-axis.
  for(c=0;c<NumOfCities;c++){
    if(maxInfectedHumans<(d3.max(time_h[c][1])))
      maxInfectedHumans=(d3.max(time_h[c][1]));
    if(maxSusceptibleHumans<(d3.max(time_h[c][2])))
      maxSusceptibleHumans=(d3.max(time_h[c][2]));
    if(maxExposedHumans<(d3.max(time_h[c][3])))
      maxExposedHumans=(d3.max(time_h[c][3]));
    if(maxRecoveredHumans<(d3.max(time_h[c][4])))
      maxRecoveredHumans=(d3.max(time_h[c][4]));
  }
}

function IhlineChart(){

  margin = {top: 10, right: 20, bottom: 30, left: 50},
  width =screen.width/(4.3) - margin.left - margin.right,
  height = screen.height/5 - margin.top - margin.bottom;

//If the plot is recreated, remove the previous one. Not necessary if there is no interactivity
if (d3.select("#LineChart")!=null){
  d3.select("#LineChart").selectAll("*").remove();
}

//svg is scalar vector graphics. It defines a way to draw graphics on HTML pages
var svg = d3.select('#LineChart').append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//supports upto 11 different colored graph
//var colors = ["#1f77b4" ,"#ff7f0e" ,"#2ca02c" ,"#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf","#1f77b4"];
var colors = color = d3.scale.category10();
xlimit = time_h[0][0][time_h[0][0].length-1];




//Creating axis according to 1st city for now, but ideally all should have similar range of time values.
//Important thing to note is that differential equation solver calculates value of y at different time intervals for different cities.
//Still the plot comes out to be correct when laid out on the same graph.

//Defines the scale mapping from time to coordinates in x, and maxInfectedHumans to svg coordinates in y axis. 
var x = d3.scale.linear()
.domain([0,xlimit])
.range([0, width]);


var y = d3.scale.linear()
.range([height, 0])
.domain([0,maxInfectedHumans]);


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
  SusceptibleHumans[c]=time_h[c][2];
  ExposedHumans[c]=time_h[c][3];
  RecoveredHumans[c]=time_h[c][4];
  
  //Defines where the x and y coordinates of lines should be placed at
  var line = d3.svg.line()
  .x(function(d,i) {   return x(d.t); })
  .y(function(d,i) {   return y(d.InfectedHumans); });

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
   .text("Ih");

//Creating the line stroke on values of [Ih,Sh,Eh,Rh] vs Time.
svg.append("path")
.datum(time_h2[c])
.attr("class", "line")
.attr("d", line)
.style("stroke",colors(c));
}

}
