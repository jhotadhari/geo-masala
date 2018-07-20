// https://www.tiny.cloud/docs/configure/file-image-upload/#file_picker_callback
const mcefilePickerCallback = ( callback, value, meta ) => {

	let mediaUploader = false;
	switch( meta.filetype ){
		case 'file':
			// callback('mypage.html', {text: 'My text'});
			break;
		case 'media':
			mediaUploader = wp.media({
				multiple: false,
				library: {
					type: [ 'video', 'audio' ]
				},
			});
			break;
		case 'image':
			mediaUploader = wp.media({
				multiple: false,
				library: {
					type: [ 'image' ]
				},
			});
			break;
		default:
			// ... nix
	}

	if ( mediaUploader ) {
		mediaUploader.open();
		mediaUploader.on('select', (e) => {
			const selected = mediaUploader.state().get('selection').first();
			let url = '';
			switch( selected.get('type') ){
				case 'image':
					const sizes = selected.get('sizes');
					// choose image size ...??? let the user choose instead
					const size = sizes.large || sizes.medium || sizes.small || sizes.full;;
					url = size.url;
					break;
				default:
					url = selected.get('url' );
			}
			callback( url );
		});
	}

};
export default mcefilePickerCallback;