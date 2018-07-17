import Backform from 'Backform';

import defaults from '../defaults';

import setFeatureAppearance 	from '../functions/setFeatureAppearance';

const ChooseIconControl = Backform.Control.extend({

	defaults: {
		label: '',
		helpMessage: null
	},

	initialize: function( options) {
		Backform.Control.prototype.initialize.apply(this, arguments);
		this.layer = options.layer;
	},

	events: _.extend({}, Backform.Control.prototype.events, {
		'click .choose-button': 'openMediaUploader',
		'click .remove-button': 'onRemoveIcon',
	}),

	template: _.template([
		'<label class="<%=Backform.controlLabelClassName%>"></label>',
		'<div class="<%=Backform.controlsClassName%>">',
		'  <img class="icon-preview" src="<%=value%>" alt="Smiley face" height="42" width="42">',
		'  <a href="#" class="choose-button button">Choose <%=label%></a>',
		'  <a href="#" class="remove-button button">Reset <%=label%></a>',
		'  <% if (helpMessage && helpMessage.length) { %>',
		'    <span class="<%=Backform.helpMessageClassName%>"><%=helpMessage%></span>',
		'  <% } %>',

		'</div>'
	].join('\n')),

	getValueFromDOM: function() {
		return this.formatter.toRaw(this.$el.find('.icon-preview').attr('src'), this.model);
	},

	openMediaUploader: function( e ) {
		if ( e ) e.preventDefault();
		this.getMediaUploader().open();
	},

	onRemoveIcon: function( e ) {
		if ( e ) e.preventDefault();
		const name = this.field.get('name');
		const geom_feature_icon = this.model.get( 'geom_feature_icon' );
		this.model.set( 'geom_feature_icon', {
			...geom_feature_icon,
			iconUrl: name.indexOf('iconUrl') != -1 ? defaults.leaflet.iconOptions.iconUrl : geom_feature_icon.iconUrl,
			shadowUrl: name.indexOf('shadowUrl') != -1 ? defaults.leaflet.iconOptions.shadowUrl : geom_feature_icon.shadowUrl,
		} );
		this.applyIcon();

	},

	getMediaUploader: function() {
		if ( ! this.mediaUploader ) {
			this.mediaUploader = wp.media.frames.file_frame = wp.media({
				title: 'Choose Icon',
				button: {
					text: 'Choose Icon'
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

			const name = self.field.get('name');
			const geom_feature_icon = self.model.get( 'geom_feature_icon' );

			// url
			let url = '';
			let goodSize = self.findGoodIconSize( geom_feature_icon.iconSize, attachment.sizes );
			if ( goodSize.length ){
				url = goodSize.url;
			} else {
				if ( ! _.isUndefined( attachment.sizes.thumbnail ) ) {
					url = attachment.sizes.thumbnail.url;
				} else if ( ! _.isUndefined( attachment.sizes.full ) ) {
					url = attachment.sizes.full.url;
				}
			}

			self.model.set( 'geom_feature_icon', {
				...geom_feature_icon,
				iconUrl: name.indexOf('iconUrl') != -1 ? url : geom_feature_icon.iconUrl,
				shadowUrl: name.indexOf('shadowUrl') != -1 ? url : geom_feature_icon.shadowUrl,
			} );

			self.applyIcon();
		});
	},

	applyIcon: function(){
		// const geom_feature_icon = this.model.get( 'geom_feature_icon' );
		// applyIcon to form
		this.render();

		// applyIcon to map layer
		// if ( this.layer.setIcon !== undefined && !_.isUndefined( geom_feature_icon.iconUrl) && geom_feature_icon.iconUrl.length) {
		// 	this.layer.setIcon( L.icon( geom_feature_icon ) );
		// }
		setFeatureAppearance( this.model, this.layer );
	},

	findGoodIconSize: function( iconSize, sizes, tolerance ){
		tolerance = tolerance || 25;
		if ( tolerance > 400 ) return [];

		let goodSizes = [];
		_.each( sizes, function( size ){
			let widthMin = iconSize[0] - ( iconSize[0] * (tolerance/100) );
			let widthMax = iconSize[0] + ( iconSize[0] * (tolerance/100) );
			let heightMin = iconSize[1] - ( iconSize[1] * (tolerance/100) );
			let heightMax = iconSize[1] + ( iconSize[1] * (tolerance/100) );
			if ( (widthMin < size.width && size.width < widthMax) && (heightMin < size.height && size.height < heightMax) ) {
				goodSizes.push( size );
			}
		});

		if ( goodSizes.length ){
			if ( goodSizes.length === 1 ){
				return goodSizes[0];
			} else {
				let goodSizesCross = _.map( goodSizes, function( size ){
					return size.width * size.height;
				});
				let smallestIndex = _.indexOf(goodSizesCross, Math.min.apply(null, goodSizesCross));
				return goodSizes[smallestIndex];
			}
		} else {
			return this.findGoodIconSize( iconSize, sizes, (tolerance * 1.5) );
		}
	},

});

export default ChooseIconControl;
