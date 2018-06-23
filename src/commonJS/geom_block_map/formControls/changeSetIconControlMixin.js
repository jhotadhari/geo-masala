let changeSetIconControlMixin = {

	initialize: function( options ){
		this.layer = this.layer || options.layer;
	},

	onChange: function(e) {
		let geom_feature_icon = this.model.get( 'geom_feature_icon' );
		if ( this.layer.setIcon !== undefined && !_.isUndefined( geom_feature_icon.iconUrl) && geom_feature_icon.iconUrl.length) {
			this.layer.setIcon( L.icon( geom_feature_icon ) );
		}

		let geom_feature_path_style = this.model.get( 'geom_feature_path_style' );
		if ( this.layer.setStyle !== undefined ) {
			this.layer.setStyle( geom_feature_path_style );
		}

	}
};

export default changeSetIconControlMixin;