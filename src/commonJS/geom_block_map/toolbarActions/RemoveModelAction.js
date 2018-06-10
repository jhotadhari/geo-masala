import L from 'leaflet';
require('leaflet-toolbar');

const RemoveModelAction = L.Toolbar2.Action.extend({
	options: {
		toolbarIcon: {
			className: 'leaflet-draw-edit-remove',
			tooltip: 'Remove',
		}
	},

	initialize: function (map, shape, options) {
		this._map = map;
		this._shape = shape;

		L.Toolbar2.Action.prototype.initialize.call(this, map, options);
	},

	addHooks: function () {
		var map = this._map;
		let shape = this._shape;

		// map.removeLayer(this._shape);
		map.removeLayer(this.toolbar);

		// console.log('firing draw:removed');
		// map.fire(L.Draw.Event.DELETED, { layers: L.layerGroup([this._shape]) });
		map.fire('draw:removed', { layer: shape });
	}
});


export default RemoveModelAction;