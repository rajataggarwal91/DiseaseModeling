/*========================================================================
Multipatch Epidemic Model for Spatial Spread of Vector-borne Diseases
readAndInitialize.js:

-------------
Parameters:
------------

Note: Community/city/region can be synchronously used.

pi_h: Host recruitment rate
beta_h: Probability of transmission per contact for susceptible hosts
mu_h: Natural death rate for the host population
sigma_h: Progression rate of human from exposed class to infected class
gamma_h: Progression rate of human from infectious class
delta_h: Disease-induced mortality rate in human
K_v: Vector carrying capacity
theta_v: Temperature-dependent maturation rate froom eggs to adult mosquito
mu_l: Temperature-dependent natural death rate for the immature vector (i.e., eggs, larvae, pupae)
mu_v: Temperature-dependent natural death rate for the adult vector
eta_s: Interaction strength for human traveling between communities
beta_v: Probability of transmission per contact for susceptible vectors
b_v: Temperature-dependent biting rate of mosquito vectors
phi_v: Temperature-dependent egg deposition rate
Nh0: Inital total number of host population in community/city i; i = 1; 2; : : : ; m; m is the number of city
Eh0: Inital Number of asymptotically exposed host population in community i
Ih0: Inital Number of infectious host population in community i
Rh0: Inital Number of recovered host population in community i
Sh0: Inital Number of susceptible host population in community i
Nv0: Inital Total number of vector population, including larvae
Lv0: Inital Number of immature (eggs, larvae, pupae) vector population in community i
Ncv0:Inital  Number of vector population in community i
Iv0: Inital Number of infectious vector population in community i
Sv0: Inital Number of susceptible vector population in community i
city: defines which city is the data representing;
Q: Fraction of the traveling human hosts (according to population size) from community i to community j. It is the rate at which individuals interact with their neighbouring environment
m: matrix to store l and r values.
l: The rate at which individuals leave their home subpopulation j and commute to subpopulation i
r: The rate at which individuals return their home subpopulation j from being in subpopulation i
MaxTime: max range of x-axis plot, can be lower to this depending on how many iteration Runge Kutta method takes.

------------
functions:
-----------
readCSV(): reads and initalizes global variables describing city parameters. 
Initalizes NumOfCities.
calls calculate_infected() when completed.

-------------------
Code Description:
------------------
readCSV() is the first function that program come across in codeflow. It reads parameters values from cities from 3 files: 
input_cities.csv: all initial and progressional parameters
Q.csv: matrix containing fraction of humans travelling from one city to another. [needs to be n*n]
migration.csv: matrix containing migration statistics from one city to another. [needs to be n*n]

 an array of variable corresponding to each city c is read and maintained.
 c{0...NumofCities} is the iterator while reading each row from file.

 Important: d3.csv is an asynchronous function call. This means that the function in callback is executed in parallel to the rest of the code. Think of it like a multithreaded code.
 For the execution flow, it is important that all the parameters variables are initialized completely before the code is proceeded to next part - calculate_infected()
 Thus to serialize the flow, each new execution (d3.csv or calculate_infected() function call) is nested inside the prior d3.csv function callback.


Code author     : Rajat Aggarwal
Arizona State University, Tempe


========================================================================
*/


/* Initalize the variables. Defining them this way is to tell the interpreter/compiler that the variable is an array initialized to null*/
pi_h=[],beta_h=[],mu_h=[], sigma_h=[], gamma_h=[], delta_h=[], K_v=[], theta_v=[], mu_l=[], mu_v=[], eta_s=[], 
beta_v=[],b_v=[],phi_v=[],Nh0=[],Eh0=[],Ih0=[], Rh0=[],Sh0=[],Nv0=[],Lv0=[],Ncv0=[],Iv0=[],Sv0=[],city=[];
Q = [], m = [], l = [], r= [];
var t1,NumOfCities,c;
MaxTime = 5 * 365; //refers to maximum plot time x axis in number of days.

function readCSV(){
	c=0;
	d3.csv("input_cities.csv", function(data) { 
		data.forEach(function(d){ 
			//reading from file
			city[c] = d['City'];
			pi_h[c] = parseFloat(d['pi_h']);
			mu_h[c] = parseFloat(d['mu_h']);
			sigma_h[c] = parseFloat(d['sigma_h']);
			gamma_h[c] = parseFloat(d['gamma_h']);
			delta_h[c] = parseFloat(d['delta_h']);
			K_v[c] = parseFloat(d['K_v']);
			beta_h[c] = parseFloat(d['beta_h']);
			beta_v[c] = parseFloat(d['beta_v']);
			theta_v[c] = parseFloat(d['theta_v']);
			eta_s[c]=parseFloat(d['eta_s']);
			Eh0[c] = parseFloat(d['Eh0']); 
			Ih0[c] = parseFloat(d['Ih0']);
			Rh0[c] = parseFloat(d['Rh0']);
			Iv0[c] = parseFloat(d['Iv0']);
			Nh0[c] = parseFloat(d['Nh0']);
			Nv0[c] = parseFloat(d['Nv0']);
			mu_l[c] = parseFloat(d['mu_l']);
			mu_v[c] = parseFloat(d['mu_v']);
			b_v[c] = parseFloat(d['b_v']);
			
			//calculated parameters
			phi_v[c] = 6.353*b_v[c];
			Lv0[c]=5.1*K_v[c];
			Sh0[c]=Nh0[c]-Eh0[c]-Ih0[c]-Rh0[c];
			Sv0[c]=Nv0[c]-Lv0[c]-Iv0[c];
			Ncv0[c]=Nv0[c]-Lv0[c];

			c++;
		}); //end of foreach read
		
		//still inside d3.csv("input_cities.csv")
		d3.csv("q.csv",function(data){
			c=0;
			data.forEach(function(d,i){
				Q[c]=d3.values(d);
				c++;
			})

			//NumofCities initialized according to number of rows read, this will be used throughtout the program
			NumOfCities=c; 												

			//still inside d3.csv("q.csv")
			d3.csv("migration.csv",function(data){
				c=0;
				data.forEach(function(d,i){
					m[c]=d3.values(d);
					c++;

				})

				//still inside d3.csv("migration.csv")
				//this is processing on matrix Q to remove city names and just keep numeric values.
				for (t1=0;t1<c;t1++){
					for(t2=0;t2<c-1;t2++){
						Q[t1][t2]=Q[t1][t2+1];
						m[t1][t2]=m[t1][t2+1];

					}	
					Q[t1]=Q[t1].slice(0,NumOfCities); 	//slice off the last value after shifting 
					m[t1]=m[t1].slice(0,NumOfCities);
				}

				//calculating l and r matrices from m.
				for(i=0;i<NumOfCities;i++){
					l[i]= [], r[i] = [];
					for(k=0;k<NumOfCities;k++){
						l[i][k] = m[k][i];
						r[i][k] = m[i][k];
					}
				}	
				calculate_infected();   //this function will be called at the end of the execution of file. 

			}); //end of migration read
		}); //end of q read
});	//end of input cities read
}//end of readCSV function

