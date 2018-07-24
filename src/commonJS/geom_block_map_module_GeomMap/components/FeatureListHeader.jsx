/**
 * External dependencies
 */
import classnames from 'classnames';

class FeatureListHeader extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {

		const {
			style,
			className,
			classNameWrapper,
		} = this.props;

		return ([
			<div
				style={style}
				className={classnames( 'geom-features-list-header-wrapper', classNameWrapper )}
			>

				<div
					className={ classnames( 'geom-features-list-header', className )}
				>
					<span className="geom-features-list-header-title" >
						Title
					</span>

					<span className="geom-features-list-header-status" >
						Status
					</span>

					<span className="geom-features-list-header-author" >
						Author
					</span>

					<div className="geom-features-list-header-actions" >

					</div>


				</div>
			</div>
		]);
	}
}

export default FeatureListHeader;