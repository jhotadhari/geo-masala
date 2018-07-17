import setFeatureAppearance from '../functions/setFeatureAppearance';

const changeSetAppearanceMixin = {

	initialize: function( options ){
		this.layer = this.layer || options.layer;
	},

	onChange: function(e) {
		setFeatureAppearance( this.model, this.layer );
	}
};

export default changeSetAppearanceMixin;