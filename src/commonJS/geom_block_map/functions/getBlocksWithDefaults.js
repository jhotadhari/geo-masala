import defaults 			from '../defaults';

const getBlocksWithDefaults = ( atts ) => {
	return {
		featureIds: {...defaults.featureIds},
		controls: {...defaults.controls},
		mapDimensions: {...defaults.mapDimensions},
		mapOptions: {...defaults.mapOptions},
		options: {...defaults.options},
		...atts,
	};
};
export default getBlocksWithDefaults;

