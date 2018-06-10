import Marionette from 'backbone.marionette';

import ReplaceElementRegion		from './regions/ReplaceElementRegion';

export default class AppLayout extends Marionette.View {

	constructor(...args) {
		super(...args);
		this.el = _.noop;
		this.template = _.noop;
	}

	regions() {
		return {
			mapRegion: {
				el: this.options.element,
				regionClass: ReplaceElementRegion,
			},
		};
	}

}