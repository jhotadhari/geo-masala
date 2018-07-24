/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const {
    Button,
    Dashicon,
    Dropdown,
    RadioControl,
    IconButton,
    BaseControl,
} = wp.components;

class FeatureListRow extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {

		const {
			model,
			style,
			className,
			classNameWrapper,
		} = this.props;

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
				className={classnames( 'geom-features-list-item-wrapper', classNameWrapper )}
			>

				<div
					className={classnames( 'geom-features-list-item', className )}
				>

					<span className="geom-features-list-item-title" >
						{ 'string' === typeof( model.get('title') ) ? model.get('title') : model.get('title').rendered }
					</span>

					<span className="geom-features-list-item-status" >
						<Button
							onClick={ () => this.props.onEditFeature(model, 'status',  ('draft' === model.get('status') ? 'publish' : 'draft') ) }
							className={ 'geom-block' }
							disabled= { !userCanEdit }
							title={ () => {
								if ( ! userCanEdit ) {
									return 'Feature Status';
								} else {
									switch ( model.get('status') ) {
										case 'draft':
											return 'Set to publish';
											break;
										case 'publish':
										case 'trash':
											return 'Set to draft';
											break;
									}
								}
							} }
						>
							{ model.get('status') }
						</Button>
					</span>

					<span className="geom-features-list-item-author" >
						{ model.get('author_nicename') }
					</span>

					<div className="geom-features-list-item-actions" >

						{ this.props.onFlyToFeatureOnMap &&
							<Button
								onClick={ () => this.props.onFlyToFeatureOnMap( this.props.model ) }
								className={'geom-block'}
								title='Fly to Feature'
							>
								<Dashicon icon={ 'editor-contract' } className="components-panel__editor-contract" />
							</Button>
						}

						{ this.props.onAddFeatureToMap &&
							<Button
								onClick={ () => this.props.onAddFeatureToMap( this.props.model ) }
								className={'geom-block'}
								title='Add to Map'
							>
								<Dashicon icon={ 'plus' } className="components-panel__plus" />
							</Button>
						}

						{ this.props.onRemoveFeaturefromMap &&
							<Button
								onClick={ () => this.props.onRemoveFeaturefromMap( this.props.model ) }
								className={'geom-block'}
								title='Remove from Map (keep in Feature-Panel)'
							>
								<Dashicon icon={ 'minus' } className="components-panel__minus" />
							</Button>
						}

						{ this.props.onEditFeature && userCanEdit && 'trash' !== model.get('status') &&
							<Dropdown
								contentClassName="geom-popover"
								position="left center"
								expandOnMobile={true}
								className={'geom-inline-block'}
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
											onChange={ (val) => this.props.onEditFeature( model, 'geom_feature_share.user', val) }
										/>

										{ model.get('geom_feature_share.post') === ( geomData.post.id.toString() || 'allPosts' ) ? (
											<RadioControl
												label="Posts"
												help="Choose for which posts this Feature is available"
												selected={ model.get('geom_feature_share.post') }
												options={[
														{ label: 'For this Post only', value: geomData.post.id.toString() },
														{ label: 'For all Posts', value:'allPosts' },
												]}
												onChange={ (val) => this.props.onEditFeature( model, 'geom_feature_share.post', val) }
											/>
										) : (

											<BaseControl
												label="Posts"
												help="Choose for which posts this Feature is available"
											>
												<p>This Feature is available for all Posts.</p>
												<p>This Option can only be changed, from within the original post of creation</p>
											</BaseControl>

										)}

										<hr/>
										<p className="components-base-control__help">
											Known issue: This controls if the Feature appears in a Feature-Panel. If it is already in use somwhere, it will still be used, but not displayed in Feature-Panel.
										</p>

									</div>
								) }
							/>
						}

						{ this.props.onTrashDeleteFeature && userCanDelete &&
							<Button
								onClick={ () => this.props.onTrashDeleteFeature( (this.props.model.get('status') === 'trash' ? 'delete' : 'trash'), this.props.model ) }
								className={'geom-block'}
								title={ 'trash' === model.get('status') ? 'Permanently delete Feature' : 'Move Feature to Trash' }
							>
								<Dashicon
									icon={ this.props.model.get('status') === 'trash' ? 'dismiss' : 'trash' }
									className="components-panel__dismiss"
								/>
							</Button>
						}


					</div>

				</div>
			</div>
		]);
	}
}

export default FeatureListRow;