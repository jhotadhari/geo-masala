
const defaults = {
	controls: {
		searchControl: true,
		fullscreenControl: true,
		loadingControl: true,
		layersControl: ['OpenStreetMap.Mapnik','OpenTopoMap'],
		viewZoomControl: ['FlyToAction','ZoomLocationAction'],
	},
	mapDimensions: {
		width: 100,
		height: 400,
	},
	leaflet: {
		mapOptions: {
			// https://leafletjs.com/reference-1.3.0.html#map-option
			center: [28,80],
			zoom: 3,
			scrollWheelZoom: true,
			touchZoom: true,
		},
		flyToBounds: {
			// https://leafletjs.com/reference-1.3.0.html#fitbounds-options
			maxZoom: 12,
			animate: true,
			duration: 0.75,
		},
		popupOptions: {
			// https://leafletjs.com/reference-1.3.0.html#popup-option
			minWidth: 50,
			maxWidth: 300,
			maxHeight: null,
			closeButton: true,
			autoClose: true,
			closeOnEscapeKey: true,
			autoPan: true,
			keepInView: false,
			className: '',
		},
		iconOptions: {
			// https://leafletjs.com/reference-1.3.0.html#icon-option
			iconUrl: geomData.pluginDirUrl + '/images/leaflet/marker-icon.png',
			iconRetinaUrl: '',
			iconSize: {
				x: 25,
				y: 41,
			},
			iconAnchor: {
				x: 12,
				y: 41,
			},

			shadowUrl: geomData.pluginDirUrl + '/images/leaflet/marker-shadow.png',
			shadowRetinaUrl: '',
			shadowSize: {
				x: 41,
				y: 41,
			},
			shadowAnchor: {
				x: 12,
				y: 41,
			},
			popupAnchor: {
				x: 1,
				y: -34,
			},
		},
		polylineOptions: {
			stroke: true,
			color: '#3388ff',
			weight: 3,
			opacity: 1.0,
			// fill: true,			// don't set a default for fill: so L will default to: instance of L.Polygon ? true : false;
			fillColor: '#3388ff',
			fillOpacity: 0.2,
			className: '',
			interactive: true,
			smoothFactor: 1.0,
		},
	},
};
export default defaults;