import _ from 'lodash';
import classnames from 'classnames';

import L from 'leaflet';
require('leaflet-toolbar');
require('leaflet-draw');
require('leaflet-draw-toolbar/dist/leaflet.draw-toolbar');

import breakpoints from '../breakpoints';
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
				self.getContentView().render();
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
				extraClasses: ['geom-reset'],
			},
			{
				type: 'submit',
				control: Backform.ButtonControl,
				label: 'Save',
				controlGroup: 'controlGroupActions',
				groupClasses: 'form-group right',
				extraClasses: ['geom-submit'],
			},
			{
				control: Backform.SpacerControl,
				controlGroup: 'controlGroupActions',
				groupClasses: 'form-group control-spacer',
			},
		];
	},

	getContentView:function(){
		if ( ! this.popupContentView ) {
			this.popupContentView = new Form({
				model: this.getFeatureModel(),
				fields: this.getFields(),
				className: () => classnames( Backform.formClassName, 'geom-form' ),
				map: this._map,
				events: {
					submit: (e) => {
						e.preventDefault();
						this.save();
						return false;
					},
					reset: (e) => {
						e.preventDefault();
						this.reset();
						return false;
					}
				}
			});
		}
		return this.popupContentView;
	},

	getPopup:function(){
		if (! this.popup ){
			this.popup = L.popup({
				minWidth: Math.min( ($(this._map.getContainer()).outerWidth() * 0.5), 250 ),
				maxWidth: Math.min( ($(this._map.getContainer()).outerWidth() * 0.8), 450 ),
				maxHeight: $(this._map.getContainer()).outerHeight() * 0.8,
				closeOnClick: false,
			}).setContent( this.getContentView().render().el );
			this.popup.on( 'remove popupclose', (e) => this.reset() )
		}
		return this.popup;
	},

	enable: function (e) {
		if ( e ) e.preventDefault();
		this.isFullscreen = $(window).width() < breakpoints.medium;
		// remove L toolbar
		this._map.removeLayer(this.toolbar);
		if ( this.isFullscreen ) {
			// render as fullscreen
			this.getContentView().render().$el.appendTo('body').addClass('geom-fullscreen');
		} else {
			// render as popup
			this._shape.bindPopup( this.getPopup() ).openPopup();
		}
	},

	close: function(){
		if ( this.isFullscreen ) {
			this.getContentView().remove();
		} else {
			this._shape.closePopup();
			this._shape.unbindPopup();
		}
	},

	save: function() {
		this.getFeatureModel().save().then( ( data, textStatus, jqXHR ) => {
			this.getFeatureModel().store();
			if (  this.eventName ){
				this._map.fire( this.eventName , {
					layer: this._shape,
				});
			}
			this.close();
		}, ( jqXHR, textStatus, errorThrown ) => console.log( 'textStatus errorThrown', textStatus, errorThrown ) );
	},

	reset: function() {
		this.getFeatureModel().restore();
		this.getFeatureModel().store();
		// this.getContentView().render();	// we'll close it anyway
		this.close();
	},

});

export default EditAttributesBaseAction;