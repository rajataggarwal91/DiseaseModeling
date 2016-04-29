/*========================================================================

Multipatch Epidemic Model for Spatial Spread of Vector-borne Diseases
calcExec.js:
-------------
Variables:
------------
execTime : total time taken to execute full computation

------------
Functions:
-----------
calc_execTime(): see code description below

-------------------
Code Description:
-------------------
Originally this function was created to calculate execution time, but now it serves multiple purposes.
1. cityCount initialized back to 0
2. loading GIF is hidden
3. One time call to initialize temperature and precipitation maps
4. One time call to sliders()
5. Calculate execution time when everything is done, although it is not shown on web interface now.

========================================================================
Code author     : Rajat Aggarwal
Arizona State University, Tempe
========================================================================
========================================================================
*/
function calc_execTime()
{
 
 /* document.getElementById("execTime").innerHTML=execTime+" seconds";*/
  cityCount=0;
  document.getElementById("loading").style.display='none';
  tempMapInit();
  PrepMapInit();
  sliders();
  draw_legend();
  t2=performance.now();
  execTime =  (t2-t1)/1000;

  
}


