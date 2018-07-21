import Marionette from 'backbone.marionette';
import Controller from './Controller';
import Router from './Router';

_.extend(window, Backbone.Events);
window.onresize = function() { window.trigger('resize'); };

const App = Marionette.Application.extend({

	onStart() {
		'use strict';
		return this._startMediator();
	},

    _startMediator() {

        this.controller = new Controller( this.options );

        const router = new Router({
        	controller: this.controller
        });

        return router;
    }

});

export default App;