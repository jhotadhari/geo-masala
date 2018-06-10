import Cocktail from 'backbone.cocktail';

require('backbone-deep-model/distribution/deep-model');

let FeatureModel = wp.api.models.Post.extend({

	initialize: function() {
		wp.api.models.Post.prototype.initialize.apply(this, arguments);
		// this.listenTo( this, 'change', this.triggerValidate );
		// AppDetails.instance.channel.on('validate', this.isValid , this );
	},

    urlRoot: function(){
    	let url = wpApiSettings.root + wpApiSettings.versionString + 'geom_features';
    	if ( this.get('id') ) {
    		url += '/' + this.get('id');
    	}
    	return url;
    },

    url: function(){
    	let url = wpApiSettings.root + wpApiSettings.versionString + 'geom_features';
    	if ( this.get('id') ) {
    		url += '/' + this.get('id');
    	}
    	return url;
    },

	save: function( attrs, options ) {
		this.beforeSave( attrs, options );
		return wp.api.models.Post.prototype.save.call( this, attrs, options );
	},

	beforeSave: function ( attrs, options ) {
		let changedAttributes = _.omit( this.changedAttributes(), [
			// 'guid',
			// 'modified',
			// 'modified_gmt',
			// 'password',
		]);
		this._prepareItem();
	},

	_prepareItem: function(){
		let self = this;
		// prepare status
		if ( this.get('status') === 'auto-draft' ) this.set( 'status', 'draft' ,{ silent: true, });
		// prepare title
		if ( this.get('title') && this.get('title').rendered ) this.set( 'title', this.get('title').rendered,{ silent: true, });
		// stringify the  fields that should be an object
		_.each( this.fieldsToSerialize, function( key ){
			self.set( key, JSON.stringify( self.toJSON()[key] ), { silent: true, } );
		});
	},

	_save: function ( model, options ) {
		return this.save();
	},

	fieldsToSerialize: [
		'geom_feature_icon',
		'geom_feature_geo_json',
		// 'geom_feature_test',
	],

	fieldsWithRendered: [
		'title',
	],

	defaults: {
		type: 'geom_feature',

		title: '',
		// status: 'draft',
		status: 'publish',

		// geom_feature_test: '',

		geom_feature_geo_json: {

		},

		geom_feature_icon: {
			iconUrl: '',
			iconAttachment: '',
			iconRetinaUrl: '',
			iconSize: {
				x: 25,
				y: 41,
			},
			iconAnchor: {
				x: 12,
				y: 41,
			},
			shadowUrl: '',
			shadowAttachment: '',
			shadowRetinaUrl: '',
			shadowSize: {
				x: 41,
				y: 41,
			},
			shadowAnchor: {
				x: 12,
				y: 41,
			},
			popupAnchor: {
				x: 1,
				y: -34,
			},
		},

	},

	// same as wp.api.models.Post.sync, but deletes empty string responses (for serializedOptions)
	sync: function( method, model, options ) {
		let self = this;
		var beforeSend;

		options = options || {};

		// Remove date_gmt if null.
		if ( _.isNull( model.get( 'date_gmt' ) ) ) {
			model.unset( 'date_gmt' );
		}

		// Remove slug if empty.
		if ( _.isEmpty( model.get( 'slug' ) ) ) {
			model.unset( 'slug' );
		}

		if ( _.isFunction( model.nonce ) && ! _.isEmpty( model.nonce() ) ) {
			beforeSend = options.beforeSend;

			// @todo enable option for jsonp endpoints
			// options.dataType = 'jsonp';

			// Include the nonce with requests.
			options.beforeSend = function( xhr ) {
				xhr.setRequestHeader( 'X-WP-Nonce', model.nonce() );

				if ( beforeSend ) {
					return beforeSend.apply( this, arguments );
				}
			};

			// Update the nonce when a new nonce is returned with the response.
			options.complete = function( xhr ) {
				var returnedNonce = xhr.getResponseHeader( 'X-WP-Nonce' );

				if ( returnedNonce && _.isFunction( model.nonce ) && model.nonce() !== returnedNonce ) {
					model.endpointModel.set( 'nonce', returnedNonce );
				}
			};
		}

		// Add '?force=true' to use delete method when required.
		if ( this.requireForceForDelete && 'delete' === method ) {
			model.url = model.url() + '?force=true';
		}

		// if we get an empty string for a field that should be an object, dont use that string
		let _success = options.success;
		options.success = function( response, textStatus, jqXHR ){


			_.each( self.fieldsToSerialize, function( key ){
				if ( typeof response[key] === 'string' ){
					if ( response[key].length === 0 ) delete response[key];
				}
			});

			_.each( self.fieldsWithRendered, function( key ){
				response[key] = response[key].rendered || response[key];
			});

			if ( typeof _success === 'function' ) { return _success.apply( this, arguments ); }
		};

		// JSONify the fields again, if they should be an object (they got stringified before save)
		let _fail = options.fail;
		options.fail = function( response ){
			_.each( this.fieldsToSerialize, function( key ){
				if ( typeof self.toJSON()[key] === 'string' ){
					self.set( key, JSON.parse( self.toJSON()[key] ), { silent: true, } );
				}
			});
			if ( typeof _fail === 'function' ) { return _fail.apply( this, arguments ); }
		};

		return Backbone.sync( method, model, options );
	},

});

Cocktail.mixin( FeatureModel, Backbone.DeepModel.prototype );

export default FeatureModel;
