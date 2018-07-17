import Cocktail from 'backbone.cocktail';
import getNestedObject from '../../geom_block_map/functions/getNestedObject';

import changeTriggerControlMixin			from '../formControls/changeTriggerControlMixin';
import controlRender_passNameToFormatter	from '../formControls/functions/controlRender_passNameToFormatter';

const FloatControl = Backform.InputControl.extend({
    defaults: {
      type: "number",
      label: "",
      maxlength: 255,
      extraClasses: [],
      helpMessage: null,
      step: 0.1,
      min: 0,
      max: 1,
    },
    template: _.template([
		'<label class="<%=Backform.controlLabelClassName%>"><%=label%></label>',
		'<div class="<%=Backform.controlsClassName%>">',
		'  <input type="<%=type%>" min="<%=min%>" max="<%=max%>" step="<%=step%>" class="<%=Backform.controlClassName%> <%=extraClasses.join(\' \')%>" name="<%=name%>" maxlength="<%=maxlength%>" value="<%-value%>" placeholder="<%-placeholder%>" <%=disabled ? "disabled" : ""%> <%=required ? "required" : ""%> />',
		'  <% if (helpMessage && helpMessage.length) { %>',
		'    <span class="<%=Backform.helpMessageClassName%>"><%=helpMessage%></span>',
		'  <% } %>',
		'</div>'
    ].join("\n")),
	formatter:{
		fromRaw: function(rawData, model, name ) {
			const data = undefined === rawData || null === rawData || isNaN(rawData) ? getNestedObject( model.defaults, name ) : rawData;
			return data.toString();
		},
		toRaw: function(formattedData, model) {
			return parseFloat(formattedData);
		}
	},
	render: controlRender_passNameToFormatter,
});
Cocktail.mixin( FloatControl, changeTriggerControlMixin );

export default FloatControl;