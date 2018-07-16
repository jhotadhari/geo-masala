import Cocktail from 'backbone.cocktail';

import changeTriggerControlMixin		from '../formControls/changeTriggerControlMixin';

const PosIntControl = Backform.InputControl.extend({
    defaults: {
      type: "number",
      label: "",
      maxlength: 255,
      extraClasses: [],
      helpMessage: null,
    },
	formatter:{
		fromRaw: function(rawData, model) {
			return Math.abs(rawData).toString();
		},
		toRaw: function(formattedData, model) {
			return parseInt(formattedData) <= 0 ? 1 : parseInt(formattedData);
		}
	},
});
Cocktail.mixin( PosIntControl, changeTriggerControlMixin );

export default PosIntControl;