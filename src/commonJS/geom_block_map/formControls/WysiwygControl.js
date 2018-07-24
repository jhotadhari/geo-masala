/**
 * External dependencies
 */
import Backform from 'Backform';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
// wp.utils.keycodes isFinite depracted since gb 3.4 use wp.keycodes instead
const { F10, ESCAPE, ALT } = wp.utils.keycodes || wp.keycodes;

import deviceIs 				from '../functions/deviceIs';
import mcefilePickerCallback 	from '../functions/mcefilePickerCallback';

/**
 * Wysiwyg Control
 *
 * The tinyMce integration is mostly copied from the gutenberg/core-blocks/freeform component (classic editor)
 *
 */
const WysiwygControl = Backform.Control.extend({

	defaults: {
		label: '',
		helpMessage: null
	},

	// ./form.js inits the controls with options for layer and model
	initialize( options ) {
		Backform.Control.prototype.initialize.apply(this, arguments);
		this.layer = options.layer;
	},

	template: _.template([
		'<label class="<%=Backform.controlLabelClassName%>"><%=label%></label>',
		'<div class="<%=Backform.controlsClassName%>">',
		'  <div class="geom-inline-editor" <%=disabled ? "disabled" : ""%> <%=required ? "required" : ""%> >',
		'    <% if (value.length > 0) { %>',
		'      <%= value %>',
		'    <% } else { %>',
		'    	<span class="geom-placeholder">Content is empty. Click to edit</span>',
		'    <% } %>',
		'  </div>',
		'  <% if (helpMessage && helpMessage.length) { %>',
		'    <span class="<%=Backform.helpMessageClassName%>"><%=helpMessage%></span>',
		'  <% } %>',
		'</div>'
	].join('\n')),

	events: _.extend({}, Backform.Control.prototype.events, {
		'click': 'onClick',
		'dblclick': 'onClick',
	}),

	onClick(e){
		if ( e ) e.preventDefault();
		const { baseURL, suffix } = window.wpEditorL10n.tinymce;

		if ( this.editor ) return this;

		window.tinymce.EditorManager.overrideDefaults( {
			base_url: baseURL,
			suffix,
		} );

		this.initEditor();
	},

	setupToolbar(){
		if ( ! this.$toolbar ){
			// create toolbar element
			this.$toolbar = $('<div>', {
				id: 'geom-inline-editor-toolbar-' + this.cid,
				class: 'geom-inline-editor-toolbar freeform-toolbar',
				['data-placeholder']: __( 'Editor Toolbar' ),
			} );
			// append toolbar to container
			this.$el.prepend(this.$toolbar);
			// animate toolbar
			let autoHeight = this.$toolbar.css('height', 'auto').height();
			this.$toolbar.height(0).animate({height: autoHeight}, 500, () => this.$toolbar.css('height', 'auto') );
			// toolbar events
			this.$toolbar.on('keydown', this.onToolbarKeyDown.bind(this) );
		}
	},

	getEditorElement(){
		return this.$el.find('.geom-inline-editor');
	},

	initEditor() {
		const { settings } = window.wpEditorL10n.tinymce;
		if ( this.editor ) return;

		let plugins = settings.plugins.split(',');
		let toolbar1 = settings.toolbar1.split(',');
		let toolbar2 = settings.toolbar2.split(',');
		plugins.push( 'image', 'media' );
		toolbar1.splice( 1, 0, 'image', 'media' );
		toolbar1 = _.without( toolbar1, 'wp_more' );

		// setup editor element
		this.getEditorElement().attr( 'id', 'editor-' + this.cid );
		// setup toolbar element
		this.setupToolbar();

		// initialize
		wp.oldEditor.initialize( 'editor-' + this.cid, {
			tinymce: {
				...settings,
				plugins: plugins.join(','),
				toolbar1: toolbar1.join(','),
				toolbar2: toolbar2.join(','),
				inline: true,
				fixed_toolbar_container: '#geom-inline-editor-toolbar-' + this.cid,

				file_picker_callback: mcefilePickerCallback,
				//image
				image_description: false,
				image_dimensions: false,
				//media
				media_alt_source: false,
				media_poster: false,
				media_dimensions: false,
				//setup
				setup: this.onSetup.bind(this),
			},
		} );
	},

	onSetup( editor ) {
		const self = this;
		const content = this.model.get( this.field.get( 'name' ) ).rendered || this.model.get( this.field.get( 'name' ) ) || '';
		this.editor = editor;

		editor.addButton( 'kitchensink', {
			tooltip: __( 'More' ),
			icon: 'dashicon dashicons-editor-kitchensink',
			onClick: function() {
				const button = this;
				const active = ! button.active();
				button.active( active );
				editor.dom.toggleClass( self.$toolbar, 'has-advanced-toolbar', active );
			},
		} );

		editor.on( 'loadContent', () => editor.setContent( content ) );

		editor.on( 'init', () => {
			// Create the toolbar by refocussing the editor.
			editor.getBody().blur();
			editor.focus();
		} );

		// // ??? well that doesn't work... will fix that in future
		// editor.on('keydown', ( event ) => {
		// 	const { altKey } = event;
		// 	// Prevent Mousetrap from kicking in: TinyMCE already uses its own 'alt+f10' shortcut to focus its toolbar.
		// 	// if ( altKey && event.keyCode === F10 ) {
		// 	if ( event.keyCode === F10 ) {
		// 		event.stopPropagation();
		// 	}
		// });

		editor.on('KeyUp Change Paste input touchend', ( event ) => {
			// close editor if esc pressed
			if ( event.keyCode === ESCAPE ) {
				this.close(event);
			}
		});

		editor.on('focusout', ( event ) => this.onFocusoutBlur( event, this.editor.getContent() ) );
		editor.on('blur', ( event ) => this.onFocusoutBlur( event, this.editor.getContent() ) );
	},

	onFocusoutBlur(event, editorContent ) {
		// set toolbarheight fix, so it wont disappear and we can animate it
		this.$toolbar.css('height', this.$toolbar.outerHeight() );
		// get activeElement and lets see what to do
		setTimeout( () => {
			const activeElement = document.activeElement;

			if ( activeElement.id.startsWith('mce') || activeElement.classList.contains('media-modal') ){
				// fitMceWindows for mobile
				this.fitMceWindows();
				// nothing happend, set toolbarheight back to auto and get out
				this.$toolbar.css('height', 'auto' );
				return;
			}

			if ( activeElement.classList.contains('geom-reset') || activeElement.classList.contains('geom-submit') ){
				// reset/submit button clicked, save and close and trigger button
				this.setModelVal(editorContent);
				this.close(event);
				$(activeElement).trigger('click');
				return;
			}

			// we really lost the focus, save and close
			this.setModelVal(editorContent);
			this.close(event);
		}, 1 );
	},

	focus() {
		if ( this.editor ) {
			this.editor.focus();
		}
	},

	onToolbarKeyDown( event ) {
		// Prevent WritingFlow from kicking in and allow arrows navigation on the toolbar.
		event.stopPropagation();
		// Prevent Mousetrap from moving focus to the top toolbar when pressing 'alt+f10' on this block toolbar.
		event.nativeEvent.stopImmediatePropagation();
	},

	fitMceWindows(){
		// if mobile, set window to fullscreen and narrow the inputs
		if ( deviceIs('mobile') ) {
			const mceWindows = this.editor.windowManager.getWindows();
			_.each( mceWindows, (mceWindow) => {
				mceWindow.fullscreen(true);
				mceWindow.$el.find('input').css('maxWidth', '100px' );
			} );
		}
	},

	close(e){
		if ( e ) e.preventDefault();
		this.removeEditor();
	},

	setModelVal(editorContent){
		// const oldVal = this.model.get( this.field.get( 'name' ) ) || this.model.get( this.field.get( 'name' ) ).rendered;
		const newVal = this.formatter.toRaw( editorContent );
		if ( ! _.isUndefined( newVal ) ) this.model.set( 'content', newVal );
	},

	getValueFromDOM() {
		return this.formatter.toRaw( this.getEditorElement().html(), this.model );
	},

	removeEditor() {
		if ( this.editor ){
			wp.oldEditor.remove( 'editor-' + this.cid );
			this.removeToolbar().then( () => {
				delete this.editor;
				this.getEditorElement().attr( 'id', null);
				this.render(); // render, so we get the placeholder for empty content
			});
		}
	},

	removeToolbar(){
		return new Promise( ( resolve, reject ) => {
			if ( this.$toolbar ){
				this.$toolbar.animate({height: 0}, 500, () => {
					this.$toolbar.remove();
					delete this.$toolbar;
					resolve();
				});
			} else {
				resolve();
			}
		});
	},

});

export default WysiwygControl;