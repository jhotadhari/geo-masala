import _ from 'lodash';

import L from 'leaflet';
require('leaflet-toolbar');
require('leaflet-draw');
require('leaflet-draw-toolbar/dist/leaflet.draw-toolbar');

import Form from '../formControls/Form';

import FeatureModel from '../models/FeatureModel';

let EditAttributesBaseAction = L.Toolbar2.Action.extend({

	eventName: 'draw:edited:attributes',

	initialize: function (map, shape, options) {
		this._map = map;
		this._shape = shape;
		this._shape.options.editing = this._shape.options.editing || {};
		L.Toolbar2.Action.prototype.initialize.call(this, map, options);
	},

	getFeatureModel: function(){
		let self = this;
		if ( ! this.featureModel ){
			this.featureModel = new FeatureModel({ id: this._shape.postId });
			this.featureModel.fetch().done(function(){
				self.featureModel.store();
				self.getPopupContentView();
			});
		}
		return this.featureModel;
	},

	getFields: function(){
		return this.getHeaderFields().concat( this.getContentFields(), this.getFooterFields() );
	},

	getHeaderFields: function(){
		return [
			// // example
			// {
			// 	name: 'actionTab',
			// 	control: 'radio',
			// 	controlGroup: 'controlGroupTabs',
			// 	options: [
			// 		{label: 'First Tab', value: 'tab01'},
			// 	]
			// },
			// {
			// 	control: Backform.SpacerControl,
			// 	controlGroup: 'controlGroupTabs',
			// 	groupClasses: 'form-group control-spacer',
			// }
		];
	},

	getContentFields: function(){
		return [];
	},

	getFooterFields: function(){
		return [
			{
				type: 'reset',
				control: Backform.ButtonControl,
				label: 'Cancel',
				controlGroup: 'controlGroupActions',
				groupClasses: 'form-group left',
			},
			{
				type: 'submit',
				control: Backform.ButtonControl,
				label: 'Save',
				controlGroup: 'controlGroupActions',
				groupClasses: 'form-group right',
			},
			{
				control: Backform.SpacerControl,
				controlGroup: 'controlGroupActions',
				groupClasses: 'form-group control-spacer',
			},
		];
	},

	getPopupContentView:function(){
		let self = this;
		if ( ! this.popupContentView ) {
			this.popupContentView = new Form({
				model: this.getFeatureModel(),
				fields: this.getFields(),
				events: {
					submit: function(e) {
						e.preventDefault();
						self.save();
						return false;
					},
					reset: function(e) {
						e.preventDefault();
						self.reset();
						return false;
					}
				}
			});
		}
		return this.popupContentView;
	},

	getPopupContent:function(){
		return this.getPopupContentView().render().el;
	},

	getPopup:function(){
		const self = this;
		if (! this.popup ){
			this.popup = L.popup({
				minWidth: 150,
				maxWidth: 350,
				// closeOnClick: false,
			}).setContent( this.getPopupContent() );
			this.popup.on( 'remove popupclose', (e) => this.reset() )
		}

		return this.popup;
	},

	enable: function (e) {
		let self = this;
		if ( e ) e.preventDefault();
		this._map.removeLayer(this.toolbar);
		this._shape.bindPopup( this.getPopup() ).openPopup();
	},

	close: function(){
		console.log( 'close' );		// ??? debug

		// let self = this;
		this._shape.closePopup();
		this._shape.unbindPopup();
		// setTimeout( () => {
		// 	if ( this.popupContentView ) {
		// 		this.popupContentView.remove();
		// 		this.popupContentView = undefined;
		// 	}
		// }, 250 );
	},

	save: function() {
		let self = this;
		this.getFeatureModel().save().then( function( data, textStatus, jqXHR ) {
			console.log( 'save', self.getFeatureModel() );		// ??? debug

			self.getFeatureModel().store();
			if (  self.eventName ){
				self._map.fire( self.eventName , {
					layer: self._shape,
				});
			}
			self.close();
		}, function( jqXHR, textStatus, errorThrown ) {
			console.log( 'textStatus errorThrown', textStatus, errorThrown );		// ??? debug
		});
	},

	reset: function() {
		this.getFeatureModel().restore();
		this.getFeatureModel().store();
		// this.getPopupContentView().render();
		this.close();
	},

});


export default EditAttributesBaseAction;

