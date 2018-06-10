import _ from  'underscore';
import $ from 'jquery';
import Backbone from 'backbone';
Backbone.$ = $;

document.addEventListener('DOMContentLoaded', () => {
	wp.api.loadPromise.done( () => {

		const App = require('./geom_block_map_frontend/App').default;

		$('.wp-block-geom-map').each( function(){
			let geomMap = new App({
				element: this,
			});
			geomMap.start();
		});

	});
});
