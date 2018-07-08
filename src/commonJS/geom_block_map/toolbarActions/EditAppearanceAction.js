import Cocktail from 'backbone.cocktail';

import EditAttributesBaseAction					from './EditAttributesBaseAction';

import changeSetIconControlMixin		from '../formControls/changeSetIconControlMixin';
import changeTriggerControlMixin		from '../formControls/changeTriggerControlMixin';
import ChooseIconControl 				from '../formControls/ChooseIconControl';

let InputControl = Backform.InputControl.extend();
Cocktail.mixin( InputControl, changeSetIconControlMixin, changeTriggerControlMixin );

let EditAppearanceAction = EditAttributesBaseAction.extend({

	options: {
		toolbarIcon: {
			className: 'dashicons dashicons-admin-appearance geom-icon-appearance geom-icon geom-icon-medium',	// ??? dashicons-admin-appearance
			tooltip: 'Edit Appearance',
		}
	},

	getHeaderFields: function(){
		return [
			{
				name: 'actionTab',
				control: 'radio',
				controlGroup: 'controlGroupTabs',
				options: [
					{label: 'Icon', value: 'icon'},
					{label: 'Shadow', value: 'shadow'},
					{label: 'Stroke/Fill', value: 'line'},
				]
			},
			// {
			// 	control: Backform.SpacerControl,
			// 	controlGroup: 'controlGroupTabContent',
			// 	groupClasses: 'form-group control-spacer',
			// }
		];
	},

	getContentFields: function(){
		return [
			{
				name: 'geom_feature_icon.iconUrl',
				// label: 'Icon',
				control: ChooseIconControl,
				controlGroup: 'controlGroupTabContent',
				tab: 'icon',
				groupClasses: 'form-group geom-icon-choose',
				layer: this._shape,
			},
			{
				control: Backform.SpacerControl,
				controlGroup: 'controlGroupTabContent',
				tab: 'icon',
				groupClasses: 'form-group control-spacer',
			},


			{
				name: 'geom_feature_icon.iconSize.x',
				label: 'Icon Width',
				type: 'number',
				control: InputControl,
				tab: 'icon',
				controlGroup: 'controlGroupTabContent',
				groupClasses: 'form-group geom-coord left',
				layer: this._shape,
			},
			{
				name: 'geom_feature_icon.iconSize.y',
				label: 'Icon Heigth',
				type: 'number',
				control: InputControl,
				tab: 'icon',
				controlGroup: 'controlGroupTabContent',
				groupClasses: 'form-group geom-coord right',
				layer: this._shape,
			},

			{
				name: 'geom_feature_icon.iconAnchor.x',
				label: 'Icon Anchor left',
				type: 'number',
				control: InputControl,
				tab: 'icon',
				controlGroup: 'controlGroupTabContent',
				groupClasses: 'form-group geom-coord left',
				layer: this._shape,
			},
			{
				name: 'geom_feature_icon.iconAnchor.y',
				label: 'Icon Anchor top',
				type: 'number',
				control: InputControl,
				tab: 'icon',
				controlGroup: 'controlGroupTabContent',
				groupClasses: 'form-group geom-coord right',
				layer: this._shape,
			},




			{
				name: 'geom_feature_icon.shadowUrl',
				// label: 'Shadow',
				control: ChooseIconControl,
				controlGroup: 'controlGroupTabContent',
				tab: 'shadow',
				groupClasses: 'form-group geom-icon-choose',
				layer: this._shape,
			},

			{
				control: Backform.SpacerControl,
				controlGroup: 'controlGroupTabContent',
				tab: 'shadow',
				groupClasses: 'form-group control-spacer',
			},
			{
				name: 'geom_feature_icon.shadowSize.x',
				label: 'Shadow Width',
				type: 'number',
				control: InputControl,
				tab: 'shadow',
				controlGroup: 'controlGroupTabContent',
				groupClasses: 'form-group geom-coord left',
				layer: this._shape,
			},
			{
				name: 'geom_feature_icon.shadowSize.y',
				label: 'Shadow Heigth',
				type: 'number',
				control: InputControl,
				tab: 'shadow',
				controlGroup: 'controlGroupTabContent',
				groupClasses: 'form-group geom-coord right',
				layer: this._shape,
			},

			{
				name: 'geom_feature_icon.shadowAnchor.x',
				label: 'Shadow Anchor left',
				type: 'number',
				control: InputControl,
				tab: 'shadow',
				controlGroup: 'controlGroupTabContent',
				groupClasses: 'form-group geom-coord left',
				layer: this._shape,
			},
			{
				name: 'geom_feature_icon.shadowAnchor.y',
				label: 'Shadow Anchor top',
				type: 'number',
				control: InputControl,
				tab: 'shadow',
				controlGroup: 'controlGroupTabContent',
				groupClasses: 'form-group geom-coord right',
				layer: this._shape,
			},

			{
				name: 'geom_feature_path_style.weight',
				label: 'Stroke Width',
				type: 'number',
				control: InputControl,
				tab: 'line',
				controlGroup: 'controlGroupTabContent',
				groupClasses: 'form-group geom-coord',
				layer: this._shape,
			},


			// color control
			// {
			// 	name: 'geom_feature_path_style.color',
			// 	label: 'Stroke Color',
			// 	control: InputControl,
			// 	tab: 'line',
			// 	controlGroup: 'controlGroupTabContent',
			// 	groupClasses: 'form-group geom-coord',
			// 	layer: this._shape,
			// },


		];
	},

	reset: function() {
		this.getFeatureModel().restore();
		this.applyIconToLayer();
		this.setStyleToLayer();
		this.getFeatureModel().store();
		this.close();
	},

	applyIconToLayer: function(){
		let geom_feature_icon = this.getFeatureModel().get('geom_feature_icon');
		if ( this._shape.setIcon !== undefined && !_.isUndefined( geom_feature_icon.iconUrl) && geom_feature_icon.iconUrl.length) {
			this._shape.setIcon( L.icon( geom_feature_icon ) );
		}
	},

	setStyleToLayer: function(){
		let geom_feature_path_style = this.getFeatureModel().get('geom_feature_path_style');
		if ( this._shape.setStyle !== undefined ) {
			this._shape.setStyle( geom_feature_path_style );
		}
	},

});


export default EditAppearanceAction;

