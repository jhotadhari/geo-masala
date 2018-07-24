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
			mapOptions: this.options.mapOptions,
			mapDimensions: this.options.mapDimensions,
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
			const { mapDimensions, mapOptions } = this.config;

			// map element
			let mapEl = this.$('.geom-map')[0];
			$( mapEl ).css({
				height: mapDimensions.height + 'px',
				width: mapDimensions.width + '%',
			});

			// init map
			this.map = L.map( mapEl, {...defaults.leaflet.mapOptions, ...mapOptions} );

			this.getBaseLayer().addTo( this.map );
		}
	}

	featureBindPopup( featureModel, layer ) {
		if ( layer.bindPopup === undefined ) return;

		const popupContentTemplate = _.template([
			'<div class="geom-popup-content">',
			'  <h1><%=title%></h1>',
			'  <div><%=content%></div>',
			'</div',
		].join('\n'));

		const title = ! _.isUndefined( featureModel.get('title').rendered ) ? featureModel.get('title').rendered : featureModel.get('title');
		const content = ! _.isUndefined( featureModel.get('content').rendered ) ? featureModel.get('content').rendered : featureModel.get('content');

		if ( ! (title + content).length ) return;	// no content, get out of here

		const popupContent = popupContentTemplate({
			title: title,
			content: content,
		});

		const popupOptions = {...defaults.popupOptions, ...featureModel.get('geom_feature_popup_options')};
		layer.bindPopup( popupContent, popupOptions );

		layer.on( 'click', (e) => {
			// ??? we need a possibility to render as fullscreen. well later, lets open the popup
			layer.openPopup();
		});

	}

}

_.defaults( MapView.prototype, MapMixin );

export default MapView;