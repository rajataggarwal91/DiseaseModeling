/*========================================================================

Multipatch Epidemic Model for Spatial Spread of Vector-borne Diseases
PrepLineChart.js:
-------------
Variables:
------------
Prepsvg: The svg container for displaying Precipitation linechart

------------
Functions:
-----------
PrepLineChart(): draws the plot using d3 library functions. 
xlimit : 11 (this should be 12 and should start from 1 instead of 0, and this needs to be corrected)

-------------------
Code Description:
------------------
The function PreplineChart contains a standard line Chart d3 implementation, used from: http://bl.ocks.org/mbostock/3883245
The values on y axis are Precipitation(in mm) and x axis plots time values( in months)
These values are obtained from : http://data.worldbank.org/data-catalog/cckp_historical_data

========================================================================
Code author     : Rajat Aggarwal
Arizona State University, Tempe
========================================================================

========================================================================
*/


var Prepsvg;

function PrepLineChart(){

margin = {top: 20, right: 20, bottom: 30, left: 50},
width =screen.width/(4.2) - margin.left - margin.right,
height = screen.height/4.2 - margin.top - margin.bottom;

//If the plot is recreated, remove the previous one. Not necessary if there is no interactivity
if (d3.select("#PrepLineChart")!=null){
d3.select("#PrepLineChart").selectAll("*").remove();
}

//svg is scalar vector graphics. It defines a way to draw graphics on HTML pages
Prepsvg = d3.select('#PrepLineChart').append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//supports upto 11 different colored graph
//var colors = ["#1f77b4" ,"#ff7f0e" ,"#2ca02c" ,"#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf","#1f77b4"];
var colors = color = d3.scale.category10();
var xlimit = 11;

/*for(var c=0;c<NumOfCities;c++){
      time_Ih2[c]=[];
  	  for(var i=0;i<time_Ih[c][0].length;i++){
	  	      time_Ih2[c][i] = {t:time_Ih[c][0][i],InfectedHumans:time_Ih[c][1][i],SusceptibleHumans:time_Ih[c][2][i],ExposedHumans:time_Ih[c][3][i],RecoveredHumans:time_Ih[c][4][i]};
    }
}*/


//Defines the scale mapping from time to coordinates in x, and maxInfectedHumans to svg coordinates in y axis. 
var x = d3.scale.linear()
	.domain([0,xlimit])
    .range([0, width]);


var y = d3.scale.linear()
   	.range([height, 0])
   	.domain([0,400]);


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
    	return y(CountriesPrecipitation[CountriesPrepCode.indexOf(city[c])][(i+1)]); });

   //Adding labels to axes
 Prepsvg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
	 .append("text")
      .attr("x", width)
      .attr("dy", "1em")
      .style("text-anchor", "end")
      .text("Months");
	  

  Prepsvg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("mm");

//Creating the line stroke on values of Ih vs Time.
  Prepsvg.append("path")
      .datum(time_h2[c])
      .attr("class", "line")
      .attr("d", line)
      .style("stroke",colors(c));
}
AfricaMapInit();
AfricaMap();
calc_execTime();

}
