import { Marionette, swal } from '../../../vendor/vendor';
// import { L } from '../../../vendor/vendor';

import L from 'leaflet';
let test = require('leaflet-toolbar');
require('leaflet-draw');
require('leaflet-draw-toolbar/dist/leaflet.draw-toolbar');
// require('leaflet-loading');
// require('leaflet.fullscreen');
// require('leaflet-providers');
// import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';


let MediaUploaderView = Marionette.View.extend({

	// defaults: {
	// 	value: {},
	// 	buttonUploadLabel: 'Choose File',
	// 	buttonRemoveLabel: 'Remove File',
	// 	placeholderContent: 'No File Selected',
	// },
	initialize: function( options ) {
		this.attributeName = options.attributeName;
		// console.log( 'options',  options );		// ??? debug

		Marionette.View.prototype.initialize.apply(this, arguments);

		this.listenTo( this.model, 'change:' + this.attributeName, this.onChange );
		this.listenTo( this.model, 'change:' + this.attributeName + '.url', this.onChange );
		this.listenTo( this.model, 'change:' + this.attributeName + '.id', this.onChange );
	},

	tagName: 'div',
	className: 'geom-uploader',
    template: _.template([
		'<div class="image-preview">',
		'  <div class="image-preview-placeholder">No Icon Selected</div>',
		'</div>',
		'<a href="#" class="upload-button button">Choose Icon</a>',
		'<a href="#" class="remove-button button">Remove Icon</a>',
    ].join('\n')),


	events: {
		'click .upload-button': 'openMediaUploader',
		'click .remove-button': 'setValEmpty',
	},

    openMediaUploader: function( e ) {
    	if ( e ) e.preventDefault();
    	this.getMediaUploader().open();
    },

    getMediaUploader: function() {
    	if ( ! this.mediaUploader ) {
    		this.mediaUploader = wp.media.frames.file_frame = wp.media({
				title: 'Choose Icon',
				button: {
					text: 'Choose Icon'	// ??? get from conrol default
    		}, multiple: false });
    		this.mediaUploaderEvents();
    	}
    	return this.mediaUploader;
    },

	mediaUploaderEvents: function() {
		let self = this;
		this.getMediaUploader().on('select', function() {
			let attachment = self.mediaUploader.state().get('selection').first().toJSON();
			if ( ! attachment.url || _.isUndefined( attachment.url ) ) return;
			self.model.set( self.attributeName, attachment.url );
		});
	},

	setValEmpty: function( e ) {
    	if ( e ) e.preventDefault();
		this.model.set( this.attributeName, '' );
	},

	onRender: function(){
		setTimeout( this.applyToDOM.bind( this ), 0);
	},

	onChange: function( model, options ){
		setTimeout( this.applyToDOM.bind( this ), 0);
	},

	applyToDOM: function(){
		let url = this.model.get( this.attributeName, '' );

		if ( url ) {
			this.$el.find('.image-preview-placeholder').hide();
			this.$el.find('.image-preview').css({
				backgroundImage: 'url(' + url + ')',
			});
			this.$el.find('.image-url').html( url );
		} else {
			this.$el.find('.image-preview-placeholder').show();
			this.$el.find('.image-preview').css({
				backgroundImage: '',
			});
			this.$('.image-url').html( '' );
		}

	},


});





let ChooseIconAction = L.Toolbar2.Action.extend({
	options: {
		toolbarIcon: {
			className: 'leaflet-draw-edit-edit',
			tooltip: 'Choose Icon',
		}
	},
	initialize: function (map, shape, featureModel, options) {
		// console.log( 'options', map );		// ??? debug
		// console.log( 'options', shape );		// ??? debug
		// console.log( 'options', featureModel );		// ??? debug
		// console.log( 'options', options );		// ??? debug

		this._map = map;
		this._shape = shape;
		this._featureModel = featureModel;
		this._shape.options.editing = this._shape.options.editing || {};
		L.Toolbar2.Action.prototype.initialize.call(this, map, options);
	},
	enable: function (e) {
		if ( e ) e.preventDefault();
		let map = this._map;
		let shape = this._shape;

		// console.log( 'shape', shape );		// ??? debug

		map.removeLayer(this.toolbar);

		// console.log( 'this._featureModel', this._featureModel );		// ??? debug

		// let mediaUploaderView = new MediaUploaderView( {
		// 	model: this._featureModel,
		// 	attributeName: 'geom_feature_icon',
		// } ).render().el

		let content = document.createElement('div');
		content.appendChild( new MediaUploaderView( {
			model: this._featureModel,
			attributeName: 'geom_feature_icon.iconUrl',
		} ).render().el );
		content.appendChild( new MediaUploaderView( {
			model: this._featureModel,
			attributeName: 'geom_feature_icon.shadowUrl',
		} ).render().el );

		swal({
				// title: 'bla',
				content: content,
				// buttons: true,
				buttons: {
					// cancel: {
					//   text: 'Cancel',
					//   value: null,
					// },
					ok: {
					  text: 'Ok',
					  value: true,
					},
				},
		});
		// .then( ( value ) => {
		// 	// console.log( 'value', value );		// ??? debug

		// 	if ( value ) {
		// 		shape.edited = true;
		// 		this.save();
		// 	} else {
		// 		// ...
		// 	}
		// });



		// shape.editing.enable();

		// map.on('click', function () {
		// 	this.save();
		// 	shape.editing.disable();
		// }, this);
	},
	// save: function() {
	// 	var map = this._map,
	// 	shape = this._shape;
	// 	if (shape.edited) {
	// 		map.fire(L.Draw.Event.EDITED, { layers: L.layerGroup([shape]) });
	// 	}
	// 	shape.edited = false;
	// }
});


export default ChooseIconAction;