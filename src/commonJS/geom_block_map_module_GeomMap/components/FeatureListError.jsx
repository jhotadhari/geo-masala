/**
 * External dependencies
 */
import PropTypes from 'prop-types';

const FeatureListError = (props) => [
	<p style={{color:'#f00'}}>{props.errorMsg}</p>,
	<p>Check your console for details</p>
];

FeatureListError.propTypes = {
	errorMsg: PropTypes.string,
}

FeatureListError.defaultProps = {
	errorMsg: 'Some error occurred while fetching feature list'
}

export default FeatureListError;