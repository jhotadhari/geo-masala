import L from 'leaflet';
require('leaflet-toolbar');

let ZoomLocationAction = L.Toolbar2.Action.extend({
	options: {
		toolbarIcon: {
			className: 'geom-icon-center geom-icon geom-icon-medium',
			tooltip: 'Zoom to current location',
		}
	},
	initialize: function ( map, options ) {
		this._map = map;
		L.Toolbar2.Action.prototype.initialize.call( this, map, options );
	},
	enable: function (e) {
		if ( e ) e.preventDefault();
		this._map.locate({
			setView: true,
			maxZoom: 12,
		});
	},
});


export default ZoomLocationAction;