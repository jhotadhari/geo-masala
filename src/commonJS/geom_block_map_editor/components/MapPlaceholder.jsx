
const MapPlaceholder = (props) => {

	const { color, dimensions } = props;

	const style = {
		width: dimensions.width + '%',
		height: dimensions.height + 'px',
		margin: '0 auto',
	};

	return ([
		<div className="geom-placeholder" style={ style }>
			<div className="geom-placeholder-overlay">
				<div className="geom-placeholder-overlay-spinner" style={{ backgroundColor: color }}>
				</div>
			</div>
		</div>

	]);

};

export default MapPlaceholder;