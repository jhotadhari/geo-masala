import geojsonhint from '@mapbox/geojsonhint';
let L = require('leaflet');
require('leaflet-toolbar');
require('leaflet-loading');
require('leaflet.fullscreen');
require('leaflet-providers');
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

import setFeatureAppearance from './functions/setFeatureAppearance';

import FlyToAction from './toolbarActions/FlyToAction';
import ZoomLocationAction from './toolbarActions/ZoomLocationAction';

import defaults from './defaults';

const actionsMap = {
	FlyToAction: FlyToAction,
	ZoomLocationAction: ZoomLocationAction,
};

const MapMixin = {

	getBaseLayer: function() {
		if ( ! this.baseLayer ) {
			let provider = this.config.controls.layersControl;
			if ( undefined !== provider && provider.length ){
				this.baseLayer = L.tileLayer.provider( provider[0] );
			} else {
				this.baseLayer = L.tileLayer.provider('OpenTopoMap');
			}
		}
		return this.baseLayer;
	},

	getFeatureGroup: function() {
		if ( ! this.featureGroup ) {
			this.featureGroup = new L.FeatureGroup()
			this.featureGroup.addTo( this.map );
		}
		return this.featureGroup;
	},

	getSearchControl: function() {
		if ( ! this.searchControl ) {
			this.searchControl = new GeoSearchControl({
				provider: new OpenStreetMapProvider(),
				style: 'bar',                   // optional: bar|button  - default button
				showMarker: false,
				showPopup: false,
				autoClose: true,
			});
		}
		return this.searchControl;
	},

	getFullscreenControl: function() {
		if ( ! this.fullscreenControl ) {
			this.fullscreenControl = new L.Control.FullScreen({
				position: 'topleft',
				forceSeparateButton: true,
			});
		}
		return this.fullscreenControl;
	},

	getLoadingControl: function() {
		let self = this;

		if ( ! this.loadingControl ) {
			this.loadingControl = L.Control.loading({
				separate: true,
				position: 'bottomright',
			});
			this.map.addControl( this.loadingControl );
			// // make loadingControl show loading on start
			// if ( this.baseLayer.isLoading() ) {
			// 	this.loadingControl.addLoader( 'initialBaseLayer' );
			// 	this.baseLayer.on( 'load', function(e){
			// 		self.loadingControl.removeLoader( 'initialBaseLayer' );
			// 	});
			// }
		}
		return this.loadingControl;
	},

	getLayersControl: function() {
		let self = this;
		let currentLayerNames;
		let controls = this.config.controls;

		if ( ! this.layersControl ) {
			this.layersControlGroup = new L.layerGroup();
			let tileLayers = {};
			let overlays = {};
			this.layersControl = new L.control.layers( tileLayers, overlays);
		}

		// add new options
		currentLayerNames = _.pluck( self.layersControl._layers, 'name' );
		_.map( controls.layersControl, function( key ){
			if ( _.indexOf( currentLayerNames, key ) === -1 ) {
				let layerToAdd = L.tileLayer.provider( key );
				layerToAdd.name = key;
				self.layersControl.addBaseLayer( layerToAdd, key );
				self.layersControlGroup.addLayer( layerToAdd );
			}
		});

		// remove options
		currentLayerNames = _.pluck( self.layersControl._layers, 'name' );
		_.map( currentLayerNames, function( key ){
			if ( _.indexOf( controls.layersControl, key ) === -1 ) {
				let layerToRemove = _.findWhere( self.layersControlGroup.getLayers(), { name: key } );
				self.layersControl.removeLayer( layerToRemove );
				self.map.removeLayer( layerToRemove );
				self.layersControlGroup.removeLayer( layerToRemove );
			}
		});

		return this.layersControl;
	},

	getViewZoomControl: function() {

		let controls = this.config.controls;
		if ( this.viewZoomControl ) {
			if ( undefined === controls.viewZoomControl || undefined === this.viewZoomControl.actions || ( controls.viewZoomControl.length !== this.viewZoomControl.actions.length ) ) {
				this.map.removeControl( this.viewZoomControl );
				delete this.viewZoomControl;
			}
		}
		if ( ! this.viewZoomControl ) {
			let actions = [];
			if ( undefined !== controls.viewZoomControl ) {
				_.map( controls.viewZoomControl, function( key ){
					actions.push( actionsMap[key] );
				});
			}
			this.viewZoomControl = new L.Toolbar2.Control({
				actions: actions,
			});
		}
		return this.viewZoomControl;
	},

	updateControls: function() {
		let self = this;
		if ( ! this.map ) return;
		let map = this.map;
		let featureGroup = this.getFeatureGroup();

		let controls = this.config.controls;

		// searchControl
		if ( controls.searchControl ) {
			map.addControl( this.getSearchControl() );
		} else if ( this.searchControl ){
			map.removeControl( this.searchControl );
		}

		// fullscreenControl
		if ( controls.fullscreenControl ) {
			map.addControl( this.getFullscreenControl() );
		} else if ( this.fullscreenControl ){
			map.removeControl( this.fullscreenControl );
		}

		// loadingControl
		if ( controls.loadingControl ) {
			map.addControl( this.getLoadingControl() );
		} else if ( this.loadingControl ){
			map.removeControl( this.loadingControl );
		}

		// layersControl
		if ( undefined !== controls.layersControl && controls.layersControl.length > 1 ) {
			map.addControl( this.getLayersControl() );
		} else {
			map.removeControl( this.getLayersControl() );
			if ( controls.layersControl.length === 1 ) {
				map.eachLayer( function( layer ){
					if ( layer instanceof L.TileLayer ) {
						if ( layer.name !== controls.layersControl[0] )
							map.removeLayer( layer )
					}
				});
				this.baseLayer = L.tileLayer.provider(controls.layersControl[0]);
				map.addLayer( this.baseLayer );
			}
		}

		// viewZoomControl
		if ( undefined !== controls.viewZoomControl && controls.viewZoomControl.length ) {
			this.getViewZoomControl().addTo( map, featureGroup );
		} else {
			map.removeControl( this.getViewZoomControl() );
		}

	},

	updateMapFeatures: function(){
		let self = this;

		let featureGroup = this.getFeatureGroup();
		let collection = this.collection || this.state.featureCollection;

		let featureGroupAdded = false;
		collection.each( function( featureModel ) {
			let featureGroupPostIds = _.pluck( featureGroup.getLayers(), 'postId' );
			let index = _.indexOf( featureGroupPostIds, featureModel.get('id') );

			// add layer
			if ( index === -1 ) {
				featureGroupAdded = true;

				let geom_feature_geo_json = featureModel.get('geom_feature_geo_json');
				if ( ! geom_feature_geo_json ) return;

				if ( typeof geom_feature_geo_json === 'string' ) return;

				// fix typeof properties -> array to object
				if ( ! _.isUndefined( geom_feature_geo_json.properties ) && _.isArray( geom_feature_geo_json.properties ) ) {
					geom_feature_geo_json.properties = geom_feature_geo_json.properties.reduce( function( acc, cur, i ) {
						acc[i] = cur;
						return acc;
				}, {});
				}

				// validate geoJSON
				let errors = _.filter( geojsonhint.hint( geom_feature_geo_json ), function( error ){
					if ( ! _.isUndefined( error.level ) ) {
						if ( error.level === 'message' ) return false;
					} else {
						return true;
					}
				} );

				if ( errors.length > 0 ) return;

				L.geoJSON( geom_feature_geo_json, {
					onEachFeature: function ( feature, layer ) {
						// add post id to layer
						layer.postId = featureModel.get('id');
						// add layer to featureGroup
						featureGroup.addLayer( layer );

						self.featureBindPopup( featureModel, layer );
						setFeatureAppearance( featureModel, layer );

					},
				});

			}

		});

		// delete layer if item not selected anymore
		let featureGroupPostIds = _.pluck( featureGroup.getLayers(), 'postId' );
		_.filter( featureGroupPostIds, function( featureGroupPostId ) {
			if ( _.indexOf( _.pluck( collection.models, 'id' ), featureGroupPostId ) === -1 ) {
				let layersToDelete = _.findWhere( featureGroup.getLayers(), {postId: featureGroupPostId });
				featureGroup.removeLayer( layersToDelete );
			}
		});

		// flyToBounds
		if ( featureGroupAdded && ! _.isEmpty( featureGroup.getBounds() ) ) {
			this.map._stop();	 // stop panning and fly animations if any
			this.map.flyToBounds( featureGroup.getBounds(), {...defaults.leaflet.flyToBounds} );
		}

	},

}

export default MapMixin;