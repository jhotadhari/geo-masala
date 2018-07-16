import Cocktail from 'backbone.cocktail';

import changeTriggerControlMixin		from '../formControls/changeTriggerControlMixin';


const IntNullControl = Backform.InputControl.extend({
    defaults: {
      type: "number",
      label: "",
      maxlength: 255,
      extraClasses: [],
      helpMessage: null,
    },
	formatter:{
		fromRaw: function(rawData, model) {
			return rawData === null ? '-1' : rawData.toString();
		},
		toRaw: function(formattedData, model) {
			return formattedData < '0' ? null : parseInt(formattedData);
		}
	},
});
Cocktail.mixin( IntNullControl, changeTriggerControlMixin );

export default IntNullControl;