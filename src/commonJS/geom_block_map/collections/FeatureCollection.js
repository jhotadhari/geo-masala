import FeatureModel		from '../models/FeatureModel';

let FeatureCollection = wp.api.collections.Posts.extend({
	url: geomData.api.root + geomData.api.versionString + 'geom_features',
	model: FeatureModel,
});

export default FeatureCollection;