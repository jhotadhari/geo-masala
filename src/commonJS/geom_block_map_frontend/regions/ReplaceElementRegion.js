import $ from 'jquery';
import Marionette from 'backbone.marionette';

export default class ReplaceElementRegion extends Marionette.Region{

	constructor(...args) {
		_.defaults(...args, {
			replaceElement: true
		});
		super(...args);
	}

	onShow() {

		// replace id with $el id
		this.currentView.$el.attr('id', this.$el.attr('id'));

		// add classes from $el
		let classList = this.$el.attr('class').split(/\s+/);
		$.each(classList, function(index, item) {
			this.currentView.$el.addClass( item );
		}.bind( this ));
	}

}