
/*========================================================================

Multipatch Epidemic Model for Spatial Spread of Vector-borne Diseases
InfectedHumansMap.js:
-------------
Variables:
------------
IhValuesAtTime : Infected Humans values for all countries at the present time.
InfectedMapInfo : reference to an info section on right top corner of map.
InfectedMapLegend: reference to map legend
InfectedMapgeojson: reference to map geojson object. geoJson object contains information on countries code (id), boundaries (properties->polygon) from countries_geo.js file. This file simply contains country variable.
IhMap: reference for map

------------
Functions:
-----------
getClosestValues() : receives an array and a value and find the value closest in array to the passed number. The reason this is needed is because ODE creates interval size that might be different from what user sets on sliders.
AfricaMapInit(): this function is called only one at the load time. It creates a map object and adds map layer, info section, labels and attributes to it. It contains nested functions and some event listeners functions.
Nested functions:
	getColor : returs color according to the ratio to maximum that InfectedHumans fall in ([0,1])
	style : shades the countries, give basic style properties
	onEachFeature: for each features(country) defined which function gets called when mousein, mouseout and click
	highlightFeature: changes style properties when mouse over a country. Makes the country stand out. updates it
	resetFeature: when mouse is taken out, changes country style back to original
	zoomToFeature: zooms to the region when clicked on it
AfricaMap(): This function gets called everytime a change in sliders is made. This calculates IhValuesAtTime array again, removes the old geoJson and recreates it.

-------------------
Code Description:
------------------

========================================================================
Code author     : Rajat Aggarwal
Arizona State University, Tempe
========================================================================
========================================================================
*/



var  IhValuesAtTime = [], InfectedMapInfo,InfectedMapLegend,InfectedMapgeojson,IhMap,cityHighlight=false;

//Reference: Stackoverflow
function getClosestValues(a, x) 
	{
    var lo = -1, hi = a.length;
    while (hi - lo > 1) {
        var mid = Math.round((lo + hi)/2);
        if (a[mid] <= x) {
            lo = mid;
        } else {
            hi = mid;
        }
    }
    if (a[lo] == x) hi = lo;
    return [a[lo], a[hi]];
   
}


function AfricaMapInit(){

//this will create a map object with ([latitude, longitude], zoom factor)
IhMap = L.map("IhMap").setView([5, 10], 4);

//Add attribution to the map.
 L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ', {
			maxZoom: 18,
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
				'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery © <a href="http://mapbox.com">Mapbox</a>',
			id: 'mapbox.light'
		}).addTo(IhMap);

//creating a geoJson object with information on countries boundaries. Also while adding each country to the map it gets call to style() and onEachFeature().
InfectedMapgeojson = L.geoJson(countries, {
			style: style,
			onEachFeature: onEachFeature
		}).addTo(IhMap);

//MapInfo is the section on right side of map that shows information about country that is under hover.
InfectedMapInfo = L.control();
InfectedMapInfo.onAdd = function (IhMap) {
			InfectedMapInfoExists = document.getElementById('InfectedMapInfo');
			if (InfectedMapInfoExists==null)
				this._div = L.DomUtil.create('div', 'InfectedMapInfo');
			this.update();
			return this._div;
		};

InfectedMapInfo.update = function (props) {
			this._div.innerHTML = '<h4>Infected Humans Map</h4>' +  (props ?
				'<b>' + props.properties.name + '</b><br />' + Math.round(IhValuesAtTime[CountriesTempCode.indexOf(props.id)]) + ' people'
				: 'Hover over a Country');
		};

//Map legend defined color code for countries.
 InfectedMapLegend = L.control({position: 'bottomright'});
InfectedMapLegend.onAdd = function (IhMap) {

			//If info MapInfo does not exist already, it will create a new one
			var InfectedMapInfoExists = document.getElementById('InfectedMapLegend');
			var div;
			if (InfectedMapInfoExists==null)
				div = L.DomUtil.create('div', 'InfectedMapLegend');

			//Grades are categories on labels, from and to represent the lower and upper limit of grade
			var grades = [maxInfectedHumans, maxInfectedHumans*0.80,maxInfectedHumans*0.60,maxInfectedHumans*0.40,maxInfectedHumans*0.20,0],from, to, InfectedMapLabels=[];

			for (var i = 0; i < grades.length-1; i++) {
				from = grades[i];
				to = grades[i + 1];

				InfectedMapLabels.push(
					'<i style="background:' + getColor((from - 1)/(maxInfectedHumans)) + '"></i> ' +
					Math.round(to/1000,2)  + 'k' + ( from ? '&ndash;' + Math.round(from/1000,2)  + 'k': '-'));
			}

			div.innerHTML = InfectedMapLabels.join('<br>');
			return div;
		};

//Add everything defined above to the map
InfectedMapInfo.addTo(IhMap);
InfectedMapLegend.addTo(IhMap);
IhMap.attributionControl.addAttribution('Infected Humans');

function getColor(d) {
			
			return d > 0.80  ? '#d7191c' : 
				   d > 0.60  ? '#fdae61' : 
				   d > 0.40  ? '#ffffbf' : 
				   d > 0.20  ? '#a6d96a' : 
				   d > 0  	 ? '#1a9641' : 
				   			   'rgb(255,255,255)' ;
			                  
		}


function style(feature) {
			
				i = city.indexOf(feature.id);
			return {
				weight: 2,
				opacity: 1,
				color: 'white',
				dashArray: '3',
				fillOpacity: 0.7,
				fillColor: getColor(IhValuesAtTime[i]/maxInfectedHumans)
			};
		}

function onEachFeature(feature, layer) {
			layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlight,
				click: zoomToFeature

			});
		}

		

function highlightFeature(e) {
			var layer = e.target;

			layer.setStyle({
				weight: 5,
				color: '#666',
				dashArray: '',
				fillOpacity: 0.7
			});

			if (!L.Browser.ie && !L.Browser.opera) {
				layer.bringToFront();
			}

			InfectedMapInfo.update(layer.feature);
		}

		

function resetHighlight(e) {
			InfectedMapgeojson.resetStyle(e.target);
			
		}

function zoomToFeature(e) {
			IhMap.fitBounds(e.target.getBounds());
			cityHighlight=true;



		}
//Functions above are nested in AfricaMapInit. So for these functions to get access out of AfricaMapInit we assign the references.
AfricaMapInit.getColor = getColor;
AfricaMapInit.style = style;
AfricaMapInit.onEachFeature=onEachFeature;
AfricaMapInit.highlightFeature=highlightFeature;
AfricaMapInit.resetHighlight=resetHighlight;
AfricaMapInit.zoomToFeature=zoomToFeature;


}

function AfricaMap(){

//calculate IhValuesAtTime values.
for (i=0;i<ncity;i++){
  IhValuesAtTime[i] =time_h[i][1][[time_h[i][0].indexOf(getClosestValues(time_h[i][0],time)[0])]];
}

	
//remove the existing geojson object, create a new one with updated IhValuesAtTime[i] values
IhMap.removeLayer(InfectedMapgeojson);
InfectedMapgeojson = L.geoJson(countries, {
			style: AfricaMapInit.style,
			onEachFeature: AfricaMapInit.onEachFeature
		}).addTo(IhMap);


}


