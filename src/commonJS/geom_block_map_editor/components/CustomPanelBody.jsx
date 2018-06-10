/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const {
    PanelBody,
    Button,
    Dashicon,
} = wp.components;

class CustomPanelBody extends PanelBody {

	onAddNewFeature(e){
		if (e) e.preventDefault();
		this.props.onAddNewFeature();
	}

	render() {
		const { title, children, opened, className } = this.props;
		const isOpened = opened === undefined ? this.state.opened : opened;
		const arrow = 'arrow-' + ( isOpened ? 'up' : 'down' );
		const classes = classnames( 'components-panel__body  geom-components-custom-panel', className, { 'is-opened': isOpened } );

		return (
			<div className={ classes }>
				{ !! title && ([
					<h2 className="components-panel__body-title">


						<Button
							className="components-panel__body-toggle"
							onClick={ this.toggle }
							aria-expanded={ isOpened }
						>

							<span>{ title }</span>
						</Button>

						<Button
							className='geom-components-custom-panel-button geom-add-feature'
							onClick={ this.onAddNewFeature.bind(this) }
						>
							<Dashicon icon={ 'plus' } className="components-panel__plus" />
						</Button>

						<Button
							className="components-panel__body-toggle"
							onClick={ this.toggle }
							aria-expanded={ isOpened }
						>


							<Dashicon icon={ arrow } className="components-panel__arrow" />
						</Button>



					</h2>


				]) }
				{ isOpened && children }
			</div>
		);
	}
}

export default CustomPanelBody;
