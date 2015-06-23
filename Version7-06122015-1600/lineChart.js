/*========================================================================

Multipatch Epidemic Model for Spatial Spread of Vector-borne Diseases
lineChart.js:
-------------
Variables:
------------
svg: The svg container for displaying 
time_Ih2: similar to time_Ih, but in object form (t:x,InfectedHumans:y). This is necessary for providing data to 
margin: defined margin for svg
xlimit: defines the time limit. It is considered that the time period of all the cities is same if Runge Kutta iteration count is high enough. So first city is considered to calculate maximum x axis value.
maxInfectedHumans: maximum of all cities' Infected Humans, used to find maximum value of plot on y axis.

------------
Functions:
-----------
lineChart(): draws the plot using d3 library functions. calls drawlegend() and calc_execTime() once after lineChart completed its execution

-------------------
Code Description:
------------------
The function lineChart contains a standard line Chart d3 implementation, used from: http://bl.ocks.org/mbostock/3883245
The values on y axis are Infected Humans(Ih) and x axis plots time values(t)
These values were calculated and stored in global variables in calculate.js
Time_Ih2 stores theses values in object format that path attribute of svg requires in its datum attribute.

Code author     : Rajat Aggarwal
Arizona State University, Tempe

========================================================================
*/


var svg, time_Ih2;

function lineChart(){

margin = {top: 50, right: 20, bottom: 30, left: 250},
width = 960 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

//If the plot is recreated, remove the previous one. Not necessary if there is no interactivity
if (svg!=null){
d3.selectAll("svg").remove();
}

//svg is scalar vector graphics. It defines a way to draw graphics on HTML pages
svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//supports upto 11 different colored graph
var colors = ["#1f77b4" ,"#ff7f0e" ,"#2ca02c" ,"#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf","#1f77b4"];
var xlimit = time_Ih[0][0][time_Ih[0][0].length-1];


//time_Ih contains the key value pair of Ih and time.
for(var c=0;c<NumOfCities;c++){
      time_Ih2[c]=[];
  	  for(var i=0;i<time_Ih[c][0].length;i++){
	  	      time_Ih2[c][i] = {t:time_Ih[c][0][i],InfectedHumans:time_Ih[c][1][i]};
    }
}


for(c=0;c<NumOfCities;c++){
if(maxInfectedHumans<(d3.max(time_Ih[c][1])))
	maxInfectedHumans=(d3.max(time_Ih[c][1]));
}

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

  t[c]=time_Ih[c][0];
  InfectedHumans[c]=time_Ih[c][1];
  
  
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
      .text("Time");
	  

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Ih");

//Creating the line stroke on values of Ih vs Time.
  svg.append("path")
      .datum(time_Ih2[c])
      .attr("class", "line")
      .attr("d", line)
      .style("stroke",colors[c]);
}
draw_legend(); 
calc_execTime();
}
