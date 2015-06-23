/*========================================================================

Multipatch Epidemic Model for Spatial Spread of Vector-borne Diseases
calculate.js:
-------------
Variables:
------------
maxInfectedHumans: of all the cities maximum value of Ih. This is used to give max limit and thus correct scale to line chart graph plot y axis.
time_Ih: Ih vs time values multidimensional array
tempAll: wrapper data to be passed to newSpawn function. Consists of all the outside parameters which might be required to calculate and store parameter values.
t: step time variable array
InfectedHumans: Ih values at step time variable array
cityCount: counts how many time the function newSpawn has been called.
ncity: iterator for cities.
dy1 to dy10: values of parameters Sh...Ncv at each step size of Runge Kutta
sum1 to sum11: intermediate results for parts of equations, temperory variable array which changes on every iteration of Runge Kutta
 Sh...lambda_h: temperory variables used in calculations in each Runge Kutta iteration. Each city maintains its own array to avoid inconsistency due to multithreaded environment.

------------
Functions:
-----------
calculate_infected(): for all the cities ncity{0...NumOfCities} start a Ih computation in parallel with multithreaded environment
newSpawn() : function doing actual computation of InfectedHumans(Ih) using numeric.dpori function which is an ODE solver.
receive() : receive the final output from newSpawn and pass it on to global variables for further processing.

-------------------
Code Description:
------------------
calculate_infected() is called after all the parameter values are initialized in readAndInitialize.js.
This function creates new parallel threads for each city, so computation of parameter values( which is actually done in newSpawn function) is done in parallel.
A wrapper data object(tempAll[c]) corresponding to the city that is defined by ncity in the thread is being passed to newSpawn function.
After the thread completes calculation of parameter values for cities, receive() receives the returned data in time_Ih at the position defined by city c(which was loaded as ncity).
This makes sure that the data object created with returned values maintain the order of cities, even when latter threads finish faster and return than the earlier ones.
In the end when all the cities have returned and written their returned data values, lineChart() function is called.

in newSpawn() function, the values in wrapper - data was offloaded into variables. Appropriate conversion into format that will be used in equations was performed for Q,l and r.
Now, the equations that define the progression of parameters with time is an Ordinary Differential equation. TO solve this we need an ODE solver, in this case numeric.dopri has been used which is function provided by numeric.js.
The format of the function is:
y= numeric.dopri(InitialTime,MaxTime,InitalConditions,callbackFunction,error,numberOfIterations)
The returned values form the values in array y for each Runge Kutta iteration step.

Time and InfectedHumans values are extracted into their arrays and time is converted to years from days. This array is returned to the calculate_infected() which transfer it to a externally visible array object Time_Ih.


Code author     : Rajat Aggarwal
Arizona State University, Tempe

========================================================================
*/
var maxInfectedHumans=0;
var time_Ih=[],time_Ih2=[],tempAll=[];
t=[],InfectedHumans=[];
ncity=0,cityCount=0;

//entry from readCSV()
function calculate_infected(){

	while(ncity<NumOfCities){
		All=[];

		//Initial conditions on calculated values, will be different for all cities.
		tempAll[ncity]=[Sh0[ncity],Eh0[ncity],Ih0[ncity],Rh0[ncity],Lv0[ncity],Sv0[ncity],Iv0[ncity],Nh0[ncity],Nv0[ncity],Ncv0[ncity],
		beta_h,b_v,beta_v,l,r,Q,pi_h,mu_h,sigma_h,gamma_h,delta_h,K_v,phi_v,mu_l,theta_v,eta_s,mu_v,
		maxInfectedHumans,NumOfCities,ncity]; 		

		
		//Using Parallel.js to create mutlithreaded computations. Parallel constructor takes a data object (in this context it is tempAll[ncity]).
		//This is the only way to provide input to the spawned function.
		var p = new Parallel( tempAll[ncity] , { evalPath: 'eval.js' });
		p.require("http://www.numericjs.com/lib/numeric-1.2.6.js");
		p.require("http://d3js.org/d3.v3.js");  //defines which libraries are required within the spawned code block


		//Multithreading starts from next line. Orignial thread continues execution, new thread calls newSpawn() function and receives tempAll[ncity] as data argument.
		p.spawn(newSpawn).then(function receive(data){ 
		 		cityCount++; 
		 		time_Ih[data[data.length-1]]=data;     // appropriately define which city does the data corresponds to.
		 		if(cityCount==NumOfCities) 			   // when all the cities have completed their execution, call lineChart()
		 			lineChart();
		 	})
		ncity++;									   // ncity is iterator variable. This controls what value is sent across as data argument while creating new spawn.

	}

} 

//Asynchronous function called by new thread, data is a wrapper that consist of all the parameters for a city that might be required in computation of t,Ih
//returns [t,Ih,c] where c defines the city that data corresponds to.

function newSpawn(data){
	var dy1=[],dy2=[],dy3=[],dy4=[],dy5=[],dy6=[],dy7=[],dy8=[],dy9=[],dy10=[];
	var Sh=[],Eh=[],Ih=[],Rh=[],Lv=[],Sv=[],Iv=[],Nh=[],Nv=[],Ncv=[];
	var lambda_v=[],lambda_h=[];
	var Iv=[];Nh=[],Q=[],r=[],l=[];
	sum1=[],sum2=[],sum3=[],sum4=[],sum5=[],sum6=[],sum7=[],sum8=[],sum9=[],sum10=[],sum11=[];
	t=[],InfectedHumans=[],y=[],dY=[];
	t[c]=[],InfectedHumans[c]=[];

	//Offload the values from data variable.
	var c=data[data.length-1];
	var All=data.slice(0,10);
	var beta_h=data.slice(10,11);
	var b_v=data.slice(11,12);
	var beta_v=data.slice(12,13);
	var l1=data.slice(13,14);
	var r1=data.slice(14,15);
	var Q1=data.slice(15,16);
	var pi_h=data.slice(16,17);
	var mu_h=data.slice(17,18);
	var sigma_h=data.slice(18,19);
	var gamma_h=data.slice(19,20);
	var delta_h=data.slice(20,21);
	var K_v=data.slice(21,22);
	var phi_v=data.slice(22,23);
	var mu_l=data.slice(23,24);
	var theta_v=data.slice(24,25);
	var eta_s=data.slice(25,26);
	var mu_v=data.slice(26,27);
	var maxInfectedHumans=data.slice(27,28);
	var NumOfCities=data.slice(28,29);
	
	//Q1,r1,l1 act as temperory buffer to offload values from data. These variables need to be converted to correct format of n*n matrix before they are used.
	//This code just restructures the matrices to 2D matrix
	j2=[]; j2[c]=0; //create 2D array j2
	for(var i1=0;i1<NumOfCities;i1++)	{
		Q[i1]=[],r[i1]=[],l[i1]=[]; //create 2D array Q,r,l
		for(var j1=0;j1<NumOfCities;j1++)	{
			Q[i1][j1]=Q1[0][j2[c]][j1];
			r[i1][j1]=r1[0][j2[c]][j1];
			l[i1][j1]=l1[0][j2[c]][j1];
		}
		j2[c]++;
	}


		/* The equations that defines Infected Humans and other parameters at a time are Ordinary Differential equations(ODE). 
		They are solved by Runge Kutta method to approximate values of y at a particular time interval t.
		numeric.dpori is part of numeric.js library which returns the array of values by multiple iteration and computation over step values.

		The format of the function is:
		y= numeric.dopri(InitialTime,MaxTime,InitalConditions,callbackFunction,error,numberOfIterations)
		*/


	dY[c] = numeric.dopri(0,365,All,
		function(t,y)
		{ 

 		//initialization of 10 parameters, all are temperory and changes on each Runge-Kutta iteration.
 		//Each variable is still an array so that threads do not interfere in each other's data.
		sum1[c]=0,sum2[c]=0,sum3[c]=0,sum4[c]=0,sum5[c]=0,sum6[c]=0,sum7[c]=0,sum8[c]=0,sum9[c]=0,sum10[c]=0,sum11[c]=0;
 		Sh[c] = y[0];
 		Eh[c] = y[1];
 		Ih[c] = y[2];
 		Rh[c] = y[3];
 		Lv[c] = y[4];
 		Sv[c] = y[5];
 		Iv[c] = y[6];
 		Nh[c] = y[7];
 		Nv[c] = y[8];
 		Ncv[c] =y[9];
		lambda_v[c] = beta_h[0][c]*b_v[0][c]*(Iv[c]/Nh[c]); 
		lambda_h[c] = beta_v[0][c]*b_v[0][c]*(Ih[c]/Nh[c]);

		
		for(var p=0;p<l[0].length;p++){
			sum1[c]+=l[p][c]*Sh[c];
			sum2[c]+=r[p][c]*Sh[c];
			sum3[c]+=l[p][c]*Eh[c];
			sum4[c]+=r[p][c]*Eh[c];
			sum5[c]+=l[p][c]*Ih[c];
			sum6[c]+=r[p][c]*Ih[c];
			sum7[c]+=l[p][c]*Rh[c];
			sum8[c]+=r[p][c]*Rh[c];
			sum9[c]+=Q[c][p]*lambda_h[c];
			sum10[c]+=l[p][c]*Nh[c];
			sum11[c]+=r[p][c]*Nh[c];
		}//end of for loop

		dy1[c] = pi_h[0][c] - mu_h[0][c]*Sh[c] - Q[c][c]*lambda_v[c]*Sh[c]  - (sum1[c]) + (sum2[c]);
		dy2[c] = Q[c][c]*lambda_v[c]*Sh[c] - sigma_h[0][c]*Eh[c] - mu_h[0][c]*Eh[c] - (sum3[c]) + (sum4[c]);
		dy3[c] = sigma_h[0][c]*Eh[c] - mu_h[0][c]*Ih[c] - delta_h[0][c]*Ih[c] - gamma_h[0][c]*Ih[c] - (sum5[c]) + (sum6[c]);
		dy4[c] = gamma_h[0][c]*Ih[c] - mu_h[0][c]*Rh[c] - (sum7[c]) + (sum8[c]);
		dy5[c] = phi_v[0][c]*(1-Lv[c]/K_v[0][c])*(Sv[c]+Iv[c]) - mu_l[0][c]*Lv[c] - theta_v[0][c]*Lv[c];
		dy6[c] = theta_v[0][c]*Lv[c] - ((1-eta_s[0][c])*lambda_h[c] + eta_s[0][c]*(sum7[c]))*Sv[c] - mu_v[0][c]*Sv[c];
		dy7[c] = ((1-eta_s[0][c])*lambda_h[c] + eta_s[0][c]*(sum9[c]))*Sv[c] - mu_v[0][c]*Iv[c];
		dy8[c] = pi_h[0][c] - mu_h[0][c]*Nh[c] - delta_h[0][c]*Ih[c]  - (sum10[c]) + (sum11[c]);
		dy9[c] = phi_v[0][c]*(1-Lv[c]/K_v[0][c])*(Ncv[c]) - mu_l[0][c]*Lv[c] - mu_v[0][c]*Ncv[c];
		dy10[c] = theta_v[0][c]*Lv[c] - mu_v[0][c]*Ncv[c];
		
		return [dy1[c],dy2[c],dy3[c],dy4[c],dy5[c],dy6[c],dy7[c],dy8[c],dy9[c],dy10[c]]; 
	},1e-6,30000) //end of numeric.dopri function


// dY[] now consist of array of parameters at various instance of time.

t[c]=[];
InfectedHumans[c]=[];

//Read the second column of dY and create array columnwise
for (i=0;i<dY[c].y.length;i++){
	t[c][i] = dY[c].x[i]/365;
	InfectedHumans[c][i]=dY[c].y[i][2];
} 

return ([t[c],InfectedHumans[c],c]);

} //end of newSpawn function




