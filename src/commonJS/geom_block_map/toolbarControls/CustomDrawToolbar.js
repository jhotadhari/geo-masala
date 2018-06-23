import L from 'leaflet';
require('leaflet-toolbar');
require('leaflet-draw');
require('leaflet-draw-toolbar/dist/leaflet.draw-toolbar');

// copy of L.Toolbar2.DrawToolbar ... without circle
const CustomDrawToolbar = L.Toolbar2.Control.extend({
	options: {
		actions: [
			L.Toolbar2.DrawAction.Polygon,
			L.Toolbar2.DrawAction.Polyline,
			L.Toolbar2.DrawAction.Marker,
			L.Toolbar2.DrawAction.Rectangle,
			// L.Toolbar2.DrawAction.Circle
		],
		className: 'leaflet-draw-toolbar'
	}
});

export default CustomDrawToolbar;