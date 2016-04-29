
/*========================================================================

Multipatch Epidemic Model for Spatial Spread of Vector-borne Diseases
TempMap.js:
-------------
Variables:
------------
TempMapInfo : reference to an info section on right top corner of map.
TempMapLegend: reference to map legend
TempMapgeojson: reference to map geojson object. geoJson object contains information on countries code (id), boundaries (properties->polygon) from countries_geo.js file. This file simply contains country variable.
TempMap: reference for map

------------
Functions:
-----------
tempMapInit(): this function is called only one at the load time. It creates a map object and adds map layer, info section, labels and attributes to it. It contains nested functions and some event listeners functions.
Nested functions:
	getColor : returs color according to the interval that temperature fall in.
	style : shades the countries, give basic style properties
	onEachFeature: for each features(country) defined which function gets called when mousein, mouseout and click
	highlightFeature: changes style properties when mouse over a country. Makes the country stand out. updates it
	resetFeature: when mouse is taken out, changes country style back to original
	zoomToFeature: zooms to the region when clicked on it
tempMap(): This function gets called everytime a change in sliders is made. This function removes the old geoJson and recreates it with new values for precipitation depending upon time in sliders

-------------------
Code Description:
------------------

========================================================================
Code author     : Rajat Aggarwal
Arizona State University, Tempe
========================================================================
========================================================================
*/

var legned,info,geojson,map;

function tempMapInit(){
			map = L.map('map').setView([5, 10], 4);
 		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ', {
			maxZoom: 18,
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
				'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery © <a href="http://mapbox.com">Mapbox</a>',
			id: 'mapbox.light'
		}).addTo(map);
		
info = L.control();
		info.onAdd = function (map) {
		var infoExists = document.getElementById('info');
		if (infoExists==null)
			this._div = L.DomUtil.create('div', 'info');
		this.update();
		return this._div;
		};

		info.update = function (props) {
			this._div.innerHTML = '<h4>Africa Temperature Map</h4>' +  (props ?
				'<b>' + props.properties.name + '</b><br />' + CountriesTemperature[CountriesTempCode.indexOf(props.id)][((mtime*12)).toString()] + ' <sup>&#x00B0</sup>' + 'C'
				: 'Hover over a Country');
		};

		
legend = L.control({position: 'bottomright'});

		legend.onAdd = function (map) {

			var infoExists = document.getElementById('info legend');
			var div;
		if (infoExists==null)
			div = L.DomUtil.create('div', 'info legend');
			
			var grades = [36, 34, 32, 30, 28, 26, 24, 22, 20],
				labels = [],
				from, to;

			for (var i = 0; i < grades.length; i++) {
				from = grades[i];
				to = grades[i + 1];

				labels.push(
					'<i style="background:' + getColor(from-1) + '"></i> ' +
					from + (to ? '&ndash;' + to : '-'));
			}

			div.innerHTML = labels.join('<br>');
			return div;
		};

geojson = L.geoJson(countries, {
			style: style,
			onEachFeature: onEachFeature
		}).addTo(map);

info.addTo(map);
map.attributionControl.addAttribution('Temperature data');
legend.addTo(map);

function getColor(d) {
			
			return d > 36   ? '#a50026' : 
				   d > 34   ? '#d73027' : 
				   d > 32   ?  '#f46d43':
			       d > 30   ?  '#fdae61':
			       d > 28   ?  '#fee090':
			       d > 26	?  '#e0f3f8' :
			       d > 24   ?  '#abd9e9':
			       d > 22   ?  '#74add1':
			       d > 20   ?  '#4575b4' :
			       d > 18   ?  '#313695' : 'rgb(255,255,255)';
			                  
		}

function style(feature) {
		
			if(CountriesTempCode.indexOf(feature.id)==-1) 
			return{
				weight: 2,
				opacity: 1,
				color: 'white',
				dashArray: '3',
				fillOpacity: 0.7,
				fillColor: 'rgb(255,255,255)'
			};

			return {
				weight: 2,
				opacity: 1,
				color: 'white',
				dashArray: '3',
				fillOpacity: 0.7,
				fillColor: getColor(CountriesTemperature[CountriesTempCode.indexOf(feature.id)][((mtime*12)).toString()])
			};
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

			info.update(layer.feature);
		}

		

		function resetHighlight(e) {
			geojson.resetStyle(e.target);
			info.update();
		}

		function zoomToFeature(e) {
			map.fitBounds(e.target.getBounds());
		}

		function onEachFeature(feature, layer) {
			layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlight,
				click: zoomToFeature
			});
		}
tempMapInit.getColor = getColor;
	tempMapInit.style = style;
	tempMapInit.onEachFeature=onEachFeature;
	tempMapInit.highlightFeature=highlightFeature;
	tempMapInit.resetHighlight=resetHighlight;
	tempMapInit.zoomToFeature=zoomToFeature;


}




function tempMap(){
map.removeLayer(geojson);
geojson = L.geoJson(countries, {
			style: tempMapInit.style,
			onEachFeature: tempMapInit.onEachFeature
		}).addTo(map);
}

		
		

		

		


		