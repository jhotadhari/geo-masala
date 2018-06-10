import _ from  'underscore';
import $ from 'jquery';
import Backbone from 'backbone';
Backbone.$ = $;
import Backform from 'Backform';

import L from 'leaflet';
require('leaflet-toolbar');

import FeatureModel from '../models/FeatureModel';

const EditTitleAction = L.Toolbar2.Action.extend({
	options: {
		toolbarIcon: {
			className: 'leaflet-draw-edit-edit',
			tooltip: 'Edit title',
		}
	},

	initialize: function (map, shape, options) {
		this._map = map;
		this._shape = shape;
		L.Toolbar2.Action.prototype.initialize.call(this, map, options);

	},

	getFieldPrefix:function(){
		return 'geom-feature-attributes';
	},

	getFeatureModel: function(){
		let self = this;

		if ( ! this.featureModel ){
			this.featureModel = new FeatureModel({ id: this._shape.postId });
			this.featureModel.fetch().done(function(){
				console.log( 'done' );		// ??? debug

				self.getPopupContentView().render();
			});
		}
		return this.featureModel;
	},


	getPopupContentView:function(){
		let self = this;

		if ( ! this.popupContentView ) {
			this.popupContentView = new Backform.Form({
				model: this.getFeatureModel(),
				fields: [
					{
						name: "title",
						label: "Title",
						control: Backform.InputControl
					},

					{
						control: "button",
						label: "Save to server"
					}
				],
				events: {
					submit: function(e) {
						let _self = this;
						e.preventDefault();
						this.model.save().then( function( data, textStatus, jqXHR ) {
							self.save();
						}, function( jqXHR, textStatus, errorThrown ) {
							console.log( 'textStatus errorThrown', textStatus, errorThrown );		// ??? debug
						});
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
		if (! this.popup ){
			this.popup = L.popup().setContent( this.getPopupContent() );
			this.popup.on( 'remove popupclose', function(e){
				this.close();
				// this.save();
			}.bind(this));
		}

		return this.popup;
	},

	enable: function (e) {
		let self = this;
		if ( e ) e.preventDefault();

		this._map.removeLayer(this.toolbar);

		this._shape.bindPopup( this.getPopup() ).openPopup();

		// $( this.popup._wrapper ).on( 'click', '.' + this.getFieldPrefix() + '-save', function(){
		// 	self.save();
		// });
	},

	close: function(){
		let self = this;
		this._shape.unbindPopup();

		setTimeout( function(){
			if ( self.popupContentView ) {
				self.popupContentView.remove();
				self.popupContentView = undefined;
			}
		}, 250 );
	},

	save: function() {
		this._map.fire('draw:edited:attributes', {
			layer: this._shape,
			// attributes: {
			// 	title: 'test',
			// }
		});
	}

});


export default EditTitleAction;