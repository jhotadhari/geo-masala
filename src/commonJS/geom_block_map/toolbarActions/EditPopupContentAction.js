import EditAttributesBaseAction					from './EditAttributesBaseAction';

import WysiwygControl 				from '../formControls/WysiwygControl';

let InputControl = Backform.InputControl.extend();

let EditPopupContentAction = EditAttributesBaseAction.extend({

	options: {
		toolbarIcon: {
			className: 'dashicons dashicons-admin-comments geom-icon-popup geom-icon geom-icon-medium',
			tooltip: 'Edit Popup Content',
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
				]
			},
		];
	},

	getContentFields: function(){
		return [
			{
				name: "title",
				// label: "Title",
				control: Backform.InputControl,
				placeholder: 'Whats the title?',
				controlGroup: 'controlGroupTabContent',
				tab: 'titleContent',
				groupClasses: 'form-group',
				layer: this._shape,
			},
			{
				name: "content",
				// label: "Content",
				// control: Backform.InputControl,
				placeholder: 'Whats the content?',
				control: WysiwygControl,
				controlGroup: 'controlGroupTabContent',
				tab: 'titleContent',
				groupClasses: 'form-group',
				layer: this._shape,
			},
			// {
			// 	control: Backform.SpacerControl,
			// 	controlGroup: 'controlGroupTabContent',
			// 	tab: 'icon',
			// 	groupClasses: 'form-group control-spacer',
			// },
		];
	},

});

export default EditPopupContentAction;
