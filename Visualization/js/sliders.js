
/*========================================================================

Multipatch Epidemic Model for Spatial Spread of Vector-borne Diseases
sliders.js:
-------------
Variables:
------------
mtime : Month time defined by Month Slider position. Range - [0,1]
ytime : Year defined by Year Slider position. Range - [0-[maxYear-minYear]], [0-10] in our case
vslider1: controls temperature, the slider is hidden and has no effect on program
vslider2: control precipitation, the slider is hidden and has no effect on program
tslider: year time slider
mslider: Month time slider

------------
Functions:
-----------
sliders() : this sets up all the sliders and event listeners.
getMonthName() : it gets the month name when month number is given
getMonthNumber() : returns the month number when month name is given

-------------------
Code Description:
-------------------
There are 4 sliders out of which 2 are inactive right now (vslider1, vslider2). Year slider(ytime) and month slider(mtime) are used to find out 'time' which is used to calculate 
values of infected humans, precipitation and temperature data. At every slider movement functions to AfricaMap, tempMap and PrepMapFunc are made which refreshes maps with data 
at time defined by sliders. For this code section, d3.slider library is used.

=================================
Code author     : Rajat Aggarwal
Arizona State University, Tempe
=================================
========================================================================
*/
var tslider,vslider1,vslider2,mslider;
mtime=1.0/12.0, ytime=0;

function sliders(){
  if (tslider!=null)  tslider.remove();
  if (vslider1!=null)  vslider1.remove();
  if (vslider2!=null)  vslider2.remove();
  if (mslider!=null)  mslider.remove();

 
  //inactive
  vslider1 = d3.select('#Vslider1').call(d3.slider().value(temperature).orientation("vertical").axis(true).min(-4).max(4).step(1)
    .on("slide", function(evt, value) {
      d3.select("#Temperature").text(value);
    })
  .on("slideend",function(evt,value) {
    temperature = value;
    readCSV(); //will change parameter values according to temperature, which will call calculateAll()
    })
  .on("click",function(evt,value) {
    temperature = value;
    readCSV(); 
    }));

//inactive
  vslider2 = d3.select('#Vslider2').call(d3.slider().value(temperature).orientation("vertical").axis(true).min(-4).max(4).step(1)
    .on("slide", function(evt, value) {
      d3.select("#Temperature").text(value);
    })
  .on("slideend",function(evt,value) {
    temperature = value;
    readCSV(); 
    })
  .on("click",function(evt,value) {
    temperature = value;
    readCSV(); 
    }));



tslider = d3.select('#Tslider').call(d3.slider().value(time).axis(true).min(2000).max(2010).step(1)
     .on("slideend",function(evt,value) {
    
    ytime = value-2000;
    time = ytime + mtime;
           AfricaMap(); 
           tempMap();
           PrepMapFunc();
    })
  .on("click",function(evt,value) {
       
    ytime = value-2000;
    time = ytime + mtime;
           AfricaMap(); 
           tempMap();
           PrepMapFunc();
    }));


mslider = d3.select('#Mslider').call(d3.slider().scale(d3.scale.ordinal().domain(["Jan","Feb", "Mar", "Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]).rangePoints([0,1],0.5)).axis(d3.svg.axis()).snap(true).value("Jan")
   .on("slideend",function(evt,value) {
   mtime = ((getMonthNumber(value)-1)/12.0);
   time = ytime + mtime;
   //recreating Infected humans, temperature and precipitation maps according to current value ot time
           AfricaMap(); 
           tempMap();
           PrepMapFunc();
    })
  .on("click",function(evt,value) {
    
   mtime = ((getMonthNumber(value)-1)/12.0);
    time = ytime + mtime;
           AfricaMap(); 
           tempMap();
           PrepMapFunc();
    }));



}
//The below two functions were necessary for ordinal scale.
function getMonthName(MonthNo){
switch(MonthNo){
case 1: return 'Jan';
case 2: return 'Feb';
case 3: return 'Mar';
case 4: return 'Apr';
case 5: return 'May';
case 6: return 'Jun';
case 7: return 'Jul';
case 8: return 'Aug';
case 9: return 'Sep';
case 10: return 'Oct';
case 11: return 'Nov';
case 12: return 'Dec';
default: return 'Jan';
}
}

function getMonthNumber(MonthName){
switch(MonthName){
case 'Jan': return 1;
case 'Feb': return 2;
case 'Mar': return 3;
case 'Apr': return 4;
case 'May': return 5;
case 'Jun': return 6;
case 'Jul': return 7;
case 'Aug': return 8;
case 'Sep': return 9;
case 'Oct': return 10;
case 'Nov': return 11;
case 'Dec': return 12;
default: return 1;
}
}