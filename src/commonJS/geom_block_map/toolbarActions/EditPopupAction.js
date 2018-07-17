import EditAttributesBaseAction					from './EditAttributesBaseAction';

import WysiwygControl 		from '../formControls/WysiwygControl';
import FloatControl		from '../formControls/FloatControl';
import IntNullControl		from '../formControls/IntNullControl';
import WrappedInputControl	from '../formControls/WrappedInputControl';

const EditPopupAction = EditAttributesBaseAction.extend({

	options: {
		toolbarIcon: {
			className: 'dashicons dashicons-admin-comments geom-icon-popup geom-icon geom-icon-medium',
			tooltip: 'Edit Popup',
		}
	},

	getHeaderFields: function(){
		return [
			{
				name: 'actionTab',
				control: 'radio',
				controlGroup: 'controlGroupTabs',
				options: [
					{label: 'Title/Content', value: 'titleContent'},
					{label: 'Options', value: 'options'},
				]
			},
		];
	},

	getContentFields: function(){
		return [
			/*
				tab titleContent
			*/
			{
				name: "title",
				// label: "Title",
				control: WrappedInputControl,
				placeholder: 'Whats the title?',
				controlGroup: 'controlGroupTabContent',
				tab: 'titleContent',
				groupClasses: 'form-group',
				layer: this._shape,
				tag: 'h1',
			},
			{
				name: "content",
				// label: "Content",
				placeholder: 'Whats the content?',
				control: WysiwygControl,
				controlGroup: 'controlGroupTabContent',
				tab: 'titleContent',
				groupClasses: 'form-group',
				layer: this._shape,
			},


			/*
				tab options
			*/
			{
				name: "geom_feature_popup_options.minWidth",
				label: 'Minimum Width?',
				control: FloatControl,
				max: '',
				step: 1,
				controlGroup: 'controlGroupTabContent',
				tab: 'options',
				groupClasses: 'form-group geom-coord left',
				layer: this._shape,
			},
			{
				name: "geom_feature_popup_options.maxWidth",
				label: 'Maximum Width?',
				control: FloatControl,
				max: '',
				step: 1,
				controlGroup: 'controlGroupTabContent',
				tab: 'options',
				groupClasses: 'form-group geom-coord right',
				layer: this._shape,
			},
			{
				control: Backform.SpacerControl,
				controlGroup: 'controlGroupTabContent',
				tab: 'options',
				groupClasses: 'form-group control-spacer',
			},
			{
				name: "geom_feature_popup_options.maxHeight",
				label: 'Maximum Height?',
				helpMessage: 'negative will unset the maximum',
				control: IntNullControl,
				controlGroup: 'controlGroupTabContent',
				tab: 'options',
				groupClasses: 'form-group',
				layer: this._shape,
			},
			{
				control: Backform.SpacerControl,
				controlGroup: 'controlGroupTabContent',
				tab: 'options',
				groupClasses: 'form-group control-spacer',
			},
			{
				name: 'geom_feature_popup_options.closeButton',
				label: 'Close Button',
				control: Backform.CheckboxControl,
				controlGroup: 'controlGroupTabContent',
				tab: 'options',
				groupClasses: 'form-group',
				layer: this._shape,
			},
			{
				name: 'geom_feature_popup_options.autoClose',
				label: 'Auto Close',
				control: Backform.CheckboxControl,
				controlGroup: 'controlGroupTabContent',
				tab: 'options',
				groupClasses: 'form-group',
				layer: this._shape,
			},
			{
				name: 'geom_feature_popup_options.closeOnEscapeKey',
				label: 'Close on Escape Key',
				control: Backform.CheckboxControl,
				controlGroup: 'controlGroupTabContent',
				tab: 'options',
				groupClasses: 'form-group',
				layer: this._shape,
			},
			{
				name: 'geom_feature_popup_options.autoPan',
				label: 'Auto Pan',
				control: Backform.CheckboxControl,
				controlGroup: 'controlGroupTabContent',
				tab: 'options',
				groupClasses: 'form-group',
				layer: this._shape,
			},
			{
				name: 'geom_feature_popup_options.keepInView',
				label: 'Keep in View',
				control: Backform.CheckboxControl,
				controlGroup: 'controlGroupTabContent',
				tab: 'options',
				groupClasses: 'form-group',
				layer: this._shape,
			},
			{
				name: "geom_feature_popup_options.className",
				label: "Class Name",
				control: Backform.InputControl,
				controlGroup: 'controlGroupTabContent',
				tab: 'options',
				groupClasses: 'form-group',
				layer: this._shape,
			},
		];
	},

});

export default EditPopupAction;
