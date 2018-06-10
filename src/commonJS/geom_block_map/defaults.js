
const defaults = {
	controls: {
		searchControl: true,
		fullscreenControl: true,
		loadingControl: true,
		layersControl: ['OpenStreetMap.Mapnik','OpenTopoMap'],
		viewZoomControl: ['FitBoundsAction','ZoomLocationAction'],
	},
	leaflet: {
		fitBounds: {
			maxZoom: 12,
			animate: true,
			duration: 0.5,
		},
	},
};
export default defaults;