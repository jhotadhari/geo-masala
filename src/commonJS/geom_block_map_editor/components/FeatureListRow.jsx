/**
 * WordPress dependencies
 */
const {
    Button,
    Dashicon,
    Dropdown,
    RadioControl,
    IconButton,
} = wp.components;

import classnames from 'classnames';

class FeatureListRow extends React.Component {

	constructor(props) {
		super(props);
	}

	onFlyToFeature(e){
		if (e) e.preventDefault();
		this.props.onFlyToFeature( this.props.model );
	}

	onEditShareUser(val){
		let self = this;

		this.props.model.set( 'geom_feature_share.user', val.toString() )
		this.forceUpdate();	// ... may be set seState to busy, and display some kind of loader instead
		this.props.model.save().done(function(){
			self.props.onEditShare( self.props.model );
		});
	}

	onEditSharePost(val){
		let self = this;
		// let geom_feature_share = this.props.model.get('geom_feature_share');
		// geom_feature_share.post = val.toString();
		// this.props.model.set({
		// 	geom_feature_share: geom_feature_share,
		// });
		this.props.model.set( 'geom_feature_share.post', val.toString() );
		this.forceUpdate();
		this.props.model.save().done(function(){
			self.props.onEditShare( self.props.model );
		});
	}

	onAddNewFeature(e){
		if (e) e.preventDefault();
		this.props.onAddNewFeature( this.props.model );
	}

	onRemoveFeature(e){
		if (e) e.preventDefault();
		this.props.onRemoveFeature( this.props.model );
	}

	onTrashFeature(e){
		if (e) e.preventDefault();
		this.props.onTrashFeature( this.props.model );
	}

	render() {

		const {
			model,
			style,
			className,
			classNameWrapper,
		} = this.props;

		let wrapperClasses = classnames(
			'geom-components-features-list-item-wrapper',
			classNameWrapper,
		);

		let classes = classnames(
			'geom-components-features-list-item',
			className,
		);

		let userCanEdit = false;
		let userCanDelete = false;
		if ( model.get('author').toString() === geomData.user.id ){
			userCanEdit = true;
			userCanDelete = true;
		}

		return ([
			<div
				key={model.get('cid')}
				style={style}
				className={wrapperClasses}
			>

				<div
					className={classes}
				>

					<span className="geom-components-features-list-item-id" >
						{ model.get('id') }
					</span>

					<span className="geom-components-features-list-item-title" >
						{ 'string' === typeof( model.get('title') ) ? model.get('title') : model.get('title').rendered }
					</span>


					<div className="geom-components-features-list-item-actions" >
						{ this.props.onEditShare && userCanEdit &&
							<Dropdown
								contentClassName="geom-popover"
								position="left center"
								expandOnMobile={true}
								renderToggle={ ( { isOpen, onToggle, onClose } ) => (
									<Button
										onClick={ onToggle } aria-expanded={ isOpen }
										className={'geom-block'}
										title='Feature Sharing'
									>
										<Dashicon icon={ 'share' } className="components-panel__share" />
									</Button>

								) }
								renderContent={ ({ isOpen, onToggle, onClose }) => (
									<div>

										<div className="components-popover__header">
											<span className="components-popover__header-title">
												Feature Sharing
											</span>
											<IconButton className="components-popover__close" icon="no-alt" onClick={ onClose } />
										</div>

										<p className="components-base-control__help">
											Features can be used by other Blocks on other Posts.
											They can be shared between Users as well.
										</p>

										<RadioControl
											label="Users"
											help="Choose for whom this Feature is available"
											selected={ model.get('geom_feature_share.user') }
											options={[
												{ label: 'Only for me', value: geomData.user.id.toString() },
												{ label: 'For all users (read only)', value: 'publicReadOnly' },
											]}
											onChange={ this.onEditShareUser.bind(this) }
										/>

										<RadioControl
											label="Posts"
											help="Choose for which posts this Feature is available"
											selected={ model.get('geom_feature_share.post') }
											options={[
												{ label: 'For this Post only', value: geomData.post.id.toString() },
												{ label: 'For all Posts', value:'allPosts' },
											]}
											onChange={ this.onEditSharePost.bind(this) }
										/>

										<p className="components-base-control__help">
											Known issue: This controls if the Feature appears in a Feature-Pool. If it is already in use somwhere, it will still be used, but just not displayed in Feature-Pool.
										</p>

									</div>
								) }
							/>
						}

						{ this.props.onFlyToFeature &&
							<Button
								onClick={ this.onFlyToFeature.bind(this) }
								className={'geom-block'}
								title='Fly to Feature'
							>
								<Dashicon icon={ 'editor-contract' } className="components-panel__editor-contract" />
							</Button>
						}

						{ this.props.onAddNewFeature &&
							<Button
								onClick={ this.onAddNewFeature.bind(this) }
								className={'geom-block'}
								title='Add to Map'
							>
								<Dashicon icon={ 'plus' } className="components-panel__plus" />
							</Button>
						}

						{ this.props.onRemoveFeature &&
							<Button
								onClick={ this.onRemoveFeature.bind(this) }
								className={'geom-block'}
								title='Remove from Map (keep in Feature-Pool)'
							>
								<Dashicon icon={ 'minus' } className="components-panel__minus" />
							</Button>
						}

						{ this.props.onTrashFeature && userCanDelete &&
							<Button
								onClick={ this.onTrashFeature.bind(this) }
								className={'geom-block'}
								title='Move Feature to Trash'
							>
								<Dashicon icon={ 'dismiss' } className="components-panel__dismiss" />
							</Button>
						}

					</div>


				</div>
			</div>
		]);
	}
}

export default FeatureListRow;