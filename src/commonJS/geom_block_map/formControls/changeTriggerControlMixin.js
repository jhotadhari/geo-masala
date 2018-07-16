const changeTriggerControlMixin = {
	onChange: function(e) {
		let self = this;
		let attrArrPath = this.field.get('name').split('.');
		if ( attrArrPath.length > 1 ) {
			self.model.trigger( 'change:' + attrArrPath[0] );
		}
	}
};

export default changeTriggerControlMixin;