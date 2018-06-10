import FeatureModel		from '../models/FeatureModel';

let FeatureCollection = wp.api.collections.Posts.extend({
	url: wpApiSettings.root + wpApiSettings.versionString + 'geom_features',
	model: FeatureModel,
});

export default FeatureCollection;