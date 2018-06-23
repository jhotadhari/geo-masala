import L from 'leaflet';
require('leaflet-toolbar');

import defaults from '../defaults';

let FlyToAction = L.Toolbar2.Action.extend({
	options: {
		toolbarIcon: {
			className: 'geom-icon-boundingbox geom-icon geom-icon-medium',
			tooltip: 'Fit map to features',
		}
	},
	initialize: function ( map, featureGroup, options ) {
		this._map = map;
		this._featureGroup = featureGroup;
		L.Toolbar2.Action.prototype.initialize.call( this, map, options );
	},
	enable: function (e) {
		if ( e ) e.preventDefault();
		if ( this._featureGroup.getLayers().length ){
			this._map.flyToBounds( this._featureGroup.getBounds(), defaults.leaflet.flyToBounds );
		}
	},
});

export default FlyToAction;