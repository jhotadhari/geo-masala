import Marionette from 'backbone.marionette';

export default class Router extends Marionette.AppRouter {
    constructor(options) {
    	super(options);
        this._getController().triggerMethod('start');
    }
}