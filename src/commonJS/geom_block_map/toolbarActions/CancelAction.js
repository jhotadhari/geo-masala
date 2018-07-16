import L from 'leaflet';
require('leaflet-toolbar');

const CancelAction = L.Toolbar2.Action.extend({
	options: {
		toolbarIcon: {
			className: 'geom-icon-cancel geom-icon geom-icon-small',
			tooltip: 'Cancel',
		}
	},
	initialize: function (map, shape, options) {
		this._map = map;
		L.Toolbar2.Action.prototype.initialize.call(this, map, options);
	},
	enable: function (e) {
		if ( e ) e.preventDefault();
		let map = this._map;
		map.removeLayer( this.toolbar );
	},

});

export default CancelAction;