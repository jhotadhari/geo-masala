
const defaults = {
	controls: {
		searchControl: true,
		fullscreenControl: true,
		loadingControl: true,
		layersControl: ['OpenStreetMap.Mapnik','OpenTopoMap'],
		viewZoomControl: ['FlyToAction','ZoomLocationAction'],
	},
	leaflet: {
		initMapOptions: {
			center: [28,80],
			zoom: 3,
		},
		flyToBounds: {
			maxZoom: 12,
			animate: true,
			duration: 0.75,
		},
	},
};
export default defaults;