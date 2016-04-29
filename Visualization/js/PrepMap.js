
/*========================================================================

Multipatch Epidemic Model for Spatial Spread of Vector-borne Diseases
PrepMap.js:
-------------
Variables:
------------
PrepMapInfo : reference to an info section on right top corner of map.
PrepMapLegend: reference to map legend
PrepMapgeojson: reference to map geojson object. geoJson object contains information on countries code (id), boundaries (properties->polygon) from countries_geo.js file. This file simply contains country variable.
PrepMap: reference for map

------------
Functions:
-----------
PrepMapInit(): this function is called only one at the load time. It creates a map object and adds map layer, info section, labels and attributes to it. It contains nested functions and some event listeners functions.
Nested functions:
	getColor : returs color according to interval that precipitation fall in.
	style : shades the countries, give basic style properties
	onEachFeature: for each features(country) defined which function gets called when mousein, mouseout and click
	highlightFeature: changes style properties when mouse over a country. Makes the country stand out. updates it
	resetFeature: when mouse is taken out, changes country style back to original
	zoomToFeature: zooms to the region when clicked on it
PrepMap(): This function gets called everytime a change in sliders is made. This function removes the old geoJson and recreates it with new values for precipitation depending upon time in sliders

-------------------
Code Description:
------------------

========================================================================
Code author     : Rajat Aggarwal
Arizona State University, Tempe
========================================================================
========================================================================
*/

var PrepMaplegned,PrepMapinfo,PrepMapgeojson,PrepMap;

function PrepMapInit(){
			PrepMap = L.map('PrepMap').setView([5, 10], 4);
 		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ', {
			maxZoom: 18,
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
				'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery © <a href="http://mapbox.com">Mapbox</a>',
			id: 'mapbox.light'
		}).addTo(PrepMap);
		
PrepMapinfo = L.control();
		PrepMapinfo.onAdd = function (map) {
		var PrepMapinfoExists = document.getElementById('PrepMapInfo');
		if (PrepMapinfoExists==null)
			this._div = L.DomUtil.create('div', 'PrepMapInfo');
		this.update();
		return this._div;
		};

		PrepMapinfo.update = function (props) {
			this._div.innerHTML = '<h4>Africa Precipitation Map</h4>' +  (props ?
				'<b>' + props.properties.name + '</b><br />' + CountriesPrecipitation[CountriesPrepCode.indexOf(props.id)][((mtime*12)).toString()] + ' mm'
				: 'Hover over a Country');
		};

		 
PrepMaplegend = L.control({position: 'bottomright'});

		PrepMaplegend.onAdd = function (PrepMap) {

			var PrepMapinfoExists = document.getElementById('PrepMapInfo legend');
			var div;
		if (PrepMapinfoExists==null)
			div = L.DomUtil.create('div', 'PrepMapInfo legend');
			
			var grades = [600,500,400,300,200,100,0],
				labels = [],
				from, to;

			for (var i = 0; i < grades.length-1; i++) {
				from = grades[i];
				to = grades[i + 1];

				labels.push(
					'<i style="background:' + getColor(from- 0.01) + '"></i> ' +
					(to) + (from ? '&ndash;' + from : '-'));
			}

			div.innerHTML = labels.join('<br>');
			return div;
		};
//creating a geoJson object with information on countries boundaries. Also while adding each country to the map it gets call to style() and onEachFeature().
PrepMapgeojson = L.geoJson(countries, {
			style: style,
			onEachFeature: onEachFeature
		}).addTo(PrepMap);

PrepMapinfo.addTo(PrepMap);
PrepMap.attributionControl.addAttribution('Precipitation data');
PrepMaplegend.addTo(PrepMap);

function getColor(d) {
			
			return d > 500   ? '#4575b4': 
				   d > 400   ? '#abd9e9': 
				   d > 300   ? '#e0f3f8':
			       d > 200   ? '#fee090':
			       d > 100   ? '#fdae61':
			       d >= 0	?  '#d73027': 'rgb(255,255,255)';
			                  
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
				fillColor: getColor(CountriesPrecipitation[CountriesPrepCode.indexOf(feature.id)][((mtime*12)).toString()])
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

			PrepMapinfo.update(layer.feature);
		}

		

		function resetHighlight(e) {
			PrepMapgeojson.resetStyle(e.target);
			PrepMapinfo.update();
		}

		function zoomToFeature(e) {
			PrepMap.fitBounds(e.target.getBounds());
		}

		function onEachFeature(feature, layer) {
			layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlight,
				click: zoomToFeature
			});
		}

	//Functions above are nested in PrepMapInit. So for these functions to get access out of PrepMapInit we assign the references.
	PrepMapInit.getColor = getColor;
	PrepMapInit.style = style;
	PrepMapInit.onEachFeature=onEachFeature;
	PrepMapInit.highlightFeature=highlightFeature;
	PrepMapInit.resetHighlight=resetHighlight;
	PrepMapInit.zoomToFeature=zoomToFeature;


}



//remove the existing PrepMapgeojson and create a new updated one.
function PrepMapFunc(){
PrepMap.removeLayer(PrepMapgeojson);
PrepMapgeojson = L.geoJson(countries, {
			style: PrepMapInit.style,
			onEachFeature: PrepMapInit.onEachFeature
		}).addTo(PrepMap);
}

		
		

		

		


		