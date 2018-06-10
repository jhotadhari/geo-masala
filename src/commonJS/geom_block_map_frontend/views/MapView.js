import $ from 'jquery';
import Marionette from 'backbone.marionette';
let L = require('leaflet');

import MapMixin from '../../geom_block_map/MapMixin';

class MapView extends Marionette.View {
	constructor(...args) {
		_.defaults(...args, {
			// ...
		});
		super(...args);
		this.config = {
			controls: this.options.controls,
		};
		this.template = _.template('<div class="geom-map"></div>');
		this.listenTo( this.collection, 'update', this.onUpdate, this );
	}

	className() {
		return 'geom-container';
	}

	onRender() {
		setTimeout( this.initMap.bind( this ), 0);
		return this;
	}

	onUpdate(){
		this.updateMapFeatures();
		this.updateControls();
	}

	initMap(){
		if ( ! this.map  ) {

			// map element
			let mapEl = this.$('.geom-map')[0];
			$( mapEl ).css({
				height: '400px',
				width: '100%'
			});

			// init map
			this.map = L.map( mapEl,{
				center: [51.505, -0.09],
				zoom: 13,
			});

			this.getBaseLayer().addTo( this.map );
		}
	}

	featureAddPopup( layer ) {
		// ???

		// let self = this;
		// layer.on('click', function( event ) {
		// 	new L.Toolbar2.EditToolbar.Popup( event.latlng, {
		// 		actions: self.getPopupActions(),
		// 	}).addTo( self.map, layer ); // , AppDetails.instance.channel.request('featureModel:get') );
		// });
	}

}

_.extend( MapView.prototype, MapMixin);

export default MapView;