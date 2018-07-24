/**
 * External dependencies
 */
import Cocktail from 'backbone.cocktail';

/**
 * Internal dependencies
 */
import statuses 						from '../statuses';
// functions
import setFeatureAppearance				from '../functions/setFeatureAppearance';
import featureBindPopup					from '../functions/featureBindPopup';
// toolbarActions
import EditAttributesBaseAction			from './EditAttributesBaseAction';
// formControls and -mixins
import changeSetAppearanceMixin			from '../formControls/changeSetAppearanceMixin';
import changeTriggerControlMixin		from '../formControls/changeTriggerControlMixin';

// mix controls
const RadioControl = Backform.RadioControl.extend();
Cocktail.mixin( RadioControl, changeSetAppearanceMixin, changeTriggerControlMixin );

const EditStatusAction = EditAttributesBaseAction.extend({

	options: {
		toolbarIcon: {
			className: 'dashicons dashicons-visibility geom-icon-popup geom-icon geom-icon-medium',
			tooltip: 'Edit Status',
		}
	},

	getHeaderFields: function(){
		return [
			{
				name: 'actionTab',
				control: 'radio',
				controlGroup: 'controlGroupTabs',
				options: [
					{label: 'Status', value: 'status'},
				]
			},
		];
	},

	getContentFields: function(){
		return [
			/*
				tab status
			*/
			{
				name: "status",
				label: "Status",
				control: RadioControl,
				options: _.reject(statuses, (status) => status.value === 'trash' ),
				controlGroup: 'controlGroupTabContent',
				tab: 'status',
				groupClasses: 'form-group',
				layer: this._shape,
			},
		];
	},

	reset: function() {
		this.getFeatureModel().restore();
		setFeatureAppearance( this.getFeatureModel(), this._shape );
		featureBindPopup( this.getFeatureModel(), this._shape, this._map );
		this.getFeatureModel().store();
		this.close();
	},

});

export default EditStatusAction;
