/**
 * Internal dependencies
 */
// toolbarActions
import EditStatusAction from '../toolbarActions/EditStatusAction';
import EditDrawAction from '../toolbarActions/EditDrawAction';
import EditPopupAction from '../toolbarActions/EditPopupAction';
import EditAppearanceAction from '../toolbarActions/EditAppearanceAction';
import RemoveModelAction from '../toolbarActions/RemoveModelAction';
import CancelAction from '../toolbarActions/CancelAction';

const getPopupToolbarActions = ( featureModel ) => {
	let actions = [];

	if ( featureModel.get('author').toString() === geomData.user.id ) {
		actions = actions.concat([
			EditStatusAction,
		]);

		if ( 'trash' !== featureModel.get('status') ) {
			actions = actions.concat([
				EditDrawAction,
				EditPopupAction,
				EditAppearanceAction,
			]);
		}
	}

	actions = actions.concat([
		RemoveModelAction,
		CancelAction,
	]);
	return actions;
};

export default getPopupToolbarActions;