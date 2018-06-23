import $ from 'jquery';
import Marionette from 'backbone.marionette';
let L = require('leaflet');

import MapMixin from '../../geom_block_map/MapMixin';
import defaults from '../../geom_block_map/defaults';

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
			this.map = L.map( mapEl, defaults.leaflet.initMapOptions );

			this.getBaseLayer().addTo( this.map );
		}
	}

	featureBindPopup( layer, featureModel ) {
		if ( layer.bindPopup === undefined ) return;

		let popupContentTemplate = _.template([
			'<h2><%=title%></h2>',
			'<div><%=content%></div>',
		].join('\n'));

		let popupContent = popupContentTemplate({
			title: ! _.isUndefined( featureModel.get('title').rendered ) ? featureModel.get('title').rendered : featureModel.get('title'),
			content: ! _.isUndefined( featureModel.get('content').rendered ) ? featureModel.get('content').rendered : featureModel.get('content'),
		});

		layer.bindPopup( popupContent );

		layer.on( 'click', function(e) {
			layer.openPopup();
		});

	}

}

// _.extend( MapView.prototype, MapMixin );
_.defaults( MapView.prototype, MapMixin );

export default MapView;