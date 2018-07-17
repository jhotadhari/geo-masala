import Cocktail from 'backbone.cocktail';

import getNestedObject 						from '../../geom_block_map/functions/getNestedObject';

import EditAttributesBaseAction				from './EditAttributesBaseAction';

import changeSetAppearanceMixin				from '../formControls/changeSetAppearanceMixin';
import changeTriggerControlMixin			from '../formControls/changeTriggerControlMixin';
import controlRender_passNameToFormatter	from '../formControls/functions/controlRender_passNameToFormatter';


import setFeatureAppearance 	from '../functions/setFeatureAppearance';

import ChooseIconControl 		from '../formControls/ChooseIconControl';
import ColorPickerControl 		from '../formControls/ColorPickerControl';

import FloatControl 			from '../formControls/FloatControl';
Cocktail.mixin( FloatControl, changeSetAppearanceMixin );

const InputControl = Backform.InputControl.extend();
Cocktail.mixin( InputControl, changeSetAppearanceMixin, changeTriggerControlMixin );

const CheckboxControl = Backform.CheckboxControl.extend({
	render: controlRender_passNameToFormatter,
	formatter: _.extend( Backform.ControlFormatter.prototype, {
		fromRaw: (rawData, model, name) => null === rawData ? getNestedObject( model.defaults, name ) : rawData,
	}),
});
Cocktail.mixin( CheckboxControl, changeSetAppearanceMixin, changeTriggerControlMixin );

const EditAppearanceAction = EditAttributesBaseAction.extend({

	options: {
		toolbarIcon: {
			className: 'dashicons dashicons-admin-appearance geom-icon-appearance geom-icon geom-icon-medium',
			tooltip: 'Edit Appearance',
		}
	},

	getHeaderFields: function(){
		const options = [];

		if ( this._shape instanceof L.Marker ){
			options.push(
				{label: 'Icon', value: 'icon'},
				{label: 'Shadow', value: 'shadow'},
			);
		}

		if ( this._shape instanceof L.Path ){
			options.push(
				{label: 'Path', value: 'path'},
			);
		}

		return [
			{
				name: 'actionTab',
				control: 'radio',
				controlGroup: 'controlGroupTabs',
				options: options,
			},
		];
	},

	getContentFields: function(){
		return [
			/*
				tab icon
			*/
			{
				name: 'geom_feature_icon.iconUrl',
				label: 'Icon',
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
				control: FloatControl,
				max: '',
				step: 1,
				tab: 'icon',
				controlGroup: 'controlGroupTabContent',
				groupClasses: 'form-group geom-coord left',
				layer: this._shape,
			},
			{
				name: 'geom_feature_icon.iconSize.y',
				label: 'Icon Heigth',
				control: FloatControl,
				max: '',
				step: 1,
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

			/*
				tab shadow
			*/
			{
				name: 'geom_feature_icon.shadowUrl',
				label: 'Shadow',
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
				control: FloatControl,
				max: '',
				step: 1,
				tab: 'shadow',
				controlGroup: 'controlGroupTabContent',
				groupClasses: 'form-group geom-coord left',
				layer: this._shape,
			},
			{
				name: 'geom_feature_icon.shadowSize.y',
				label: 'Shadow Heigth',
				control: FloatControl,
				max: '',
				step: 1,
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

			/*
				tab path
			*/
			{
				name: 'geom_feature_path_style.stroke',
				label: 'Stroke',
				control: CheckboxControl,
				controlGroup: 'controlGroupTabContent',
				tab: 'path',
				groupClasses: 'form-group',
				layer: this._shape,
			},
			{
				name: 'geom_feature_path_style.color',
				label: 'Stroke Color',
				control: ColorPickerControl,
				controlGroup: 'controlGroupTabContent',
				tab: 'path',
				groupClasses: 'form-group',
				layer: this._shape,
			},
			{
				name: 'geom_feature_path_style.weight',
				label: 'Stroke Width',
				control: FloatControl,
				max: '',
				step: 1,
				tab: 'path',
				controlGroup: 'controlGroupTabContent',
				groupClasses: 'form-group',
				layer: this._shape,
			},
			{
				name: 'geom_feature_path_style.opacity',
				label: 'Stroke Opacity',
				control: FloatControl,
				tab: 'path',
				controlGroup: 'controlGroupTabContent',
				groupClasses: 'form-group',
				layer: this._shape,
			},
			{
				name: 'geom_feature_path_style.fill',
				label: 'Fill',
				control: CheckboxControl.extend({
					formatter: _.extend( Backform.ControlFormatter.prototype, {
						fromRaw: (rawData, model, name) => {
							return null === rawData
								? 'Polygon' === model.get('geom_feature_geo_json.geometry.type') ? true : getNestedObject( model.defaults, name )
								: rawData;
						}
					}),
				}),
				controlGroup: 'controlGroupTabContent',
				tab: 'path',
				groupClasses: 'form-group',
				layer: this._shape,
			},
			{
				name: 'geom_feature_path_style.fillColor',
				label: 'Fill Color',
				control: ColorPickerControl,
				controlGroup: 'controlGroupTabContent',
				tab: 'path',
				groupClasses: 'form-group',
				layer: this._shape,
			},
			{
				name: 'geom_feature_path_style.fillOpacity',
				label: 'Fill Opacity',
				control: FloatControl,
				tab: 'path',
				controlGroup: 'controlGroupTabContent',
				groupClasses: 'form-group',
				layer: this._shape,
			},
			{
				name: 'geom_feature_path_style.className',
				label: 'Class Name',
				control: InputControl,
				tab: 'path',
				controlGroup: 'controlGroupTabContent',
				groupClasses: 'form-group',
				layer: this._shape,
			},
			{
				name: 'geom_feature_path_style.interactive',
				label: 'Interactive',
				control: CheckboxControl,
				controlGroup: 'controlGroupTabContent',
				tab: 'path',
				groupClasses: 'form-group',
				layer: this._shape,
			},
			{
				name: 'geom_feature_path_style.smoothFactor',
				label: 'Smooth Factor',
				control: FloatControl,
				max: '',
				tab: 'path',
				controlGroup: 'controlGroupTabContent',
				groupClasses: 'form-group',
				layer: this._shape,
			},
		];
	},

	reset: function() {
		this.getFeatureModel().restore();
		setFeatureAppearance( this.getFeatureModel(), this._shape );
		this.getFeatureModel().store();
		this.close();
	},

});

export default EditAppearanceAction;
