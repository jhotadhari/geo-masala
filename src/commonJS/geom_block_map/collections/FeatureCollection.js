import FeatureModel		from '../models/FeatureModel';

const apiSettings = 'undefined' !== typeof(wpApiSettings) ? wpApiSettings : geomData.api;

const FeatureCollection = wp.api.collections.Posts.extend({
	url: apiSettings.root + apiSettings.versionString + 'geom_features',
	model: FeatureModel,
});

export default FeatureCollection;