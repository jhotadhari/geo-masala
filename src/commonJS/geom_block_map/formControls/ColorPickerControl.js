import Backform from 'Backform';
const ColorPicker = require('simple-color-picker');

import setFeatureAppearance		from '../functions/setFeatureAppearance';
import defaults		from '../defaults';

const ColorPickerControl = Backform.Control.extend({

	defaults: {
		label: '',
		maxlength: 255,
		extraClasses: [],
		helpMessage: null,
	},

	// copy of initialize, but with layer and no render on change
    initialize: function(options) {
    	// Back-reference to the field
    	this.field = options.field;

    	var formatter = Backform.resolveNameToClass(this.field.get("formatter") || this.formatter, "Formatter");
    	if (!_.isFunction(formatter.fromRaw) && !_.isFunction(formatter.toRaw)) {
    		formatter = new formatter();
    	}
    	this.formatter = formatter;

    	var attrArr = this.field.get('name').split('.');
    	var name = attrArr.shift();

    	// Listen to the field in the model for any change
    	// this.listenTo(this.model, "change:" + name, this.render);

    	// Listen for the field in the error model for any change
    	if (this.model.errorModel instanceof Backbone.Model)
    		this.listenTo(this.model.errorModel, "change:" + name, this.updateInvalid);

    	this.layer = options.layer;
	},

	events: _.extend({}, Backform.Control.prototype.events, {
		'focus input': 'openColorPicker',
		'focusout input': 'closeColorPicker',
		'input input': 'onInput',
	}),

	template: _.template([
		'<label class="<%=Backform.controlLabelClassName%>"><%=label%></label>',
		'<div class="<%=Backform.controlsClassName%>">',
		'  <input type="text" class="<%=Backform.controlClassName%> <%=extraClasses.join(\' \')%>" name="<%=name%>" maxlength="<%=maxlength%>" value="<%-value%>" placeholder="<%-placeholder%>" <%=disabled ? "disabled" : ""%> <%=required ? "required" : ""%> />',
		'  <div class="geom-color-picker" style="height: 0px;"></div>',
		'  <% if (helpMessage && helpMessage.length) { %>',
		'    <span class="<%=Backform.helpMessageClassName%>"><%=helpMessage%></span>',
		'  <% } %>',
		'</div>'
	].join('\n')),

	openColorPicker: function( e ) {
		if ( e ) e.preventDefault();
		this.getColorPicker();
	},

	closeColorPicker: function( e ) {
		this.$colorPickerWrapper.animate({
			height: '0px',
		}, () => {
			this.getColorPicker().remove();
			delete this.colorPicker;
		});
	},

	getColorPicker: function() {
		const name = this.field.get('name');
		this.$colorPickerWrapper = this.$el.find('.geom-color-picker');
		this.$input = this.$el.find('input');

		if ( ! this.colorPicker ) {
			this.colorPicker = new ColorPicker({
				color: this.model.get(name) || defaults.leaflet.polylineOptions.color,
				width: this.$input.outerWidth(),
				height: 100,
			});

			this.colorPicker.onChange( (hexStringColor) => {
				this.$input.val(hexStringColor);
				this.model.set( name, hexStringColor );
				setFeatureAppearance( this.model, this.layer );
			});
		}

		if ( ! this.$el.find('.Scp').length ) {
			this.colorPicker.appendTo( this.$colorPickerWrapper.get(0) );
			this.$colorPickerWrapper.animate({
				height: '100px',
			});
		}

		return this.colorPicker;
	},

	onInput: function(e) {
		const val = this.$input.val();
		if ( /^#([A-Fa-f0-9]{6})$/.test( val ) ) {
			this.getColorPicker().setColor(val);
		}
	}
});

export default ColorPickerControl;
