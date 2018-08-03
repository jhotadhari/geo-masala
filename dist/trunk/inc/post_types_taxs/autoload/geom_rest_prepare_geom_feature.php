<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Add some fields to geom_feature rest response data
 */
function geom_rest_prepare_geom_feature( $response, $post, $request){

	$params = $request->get_params();
	$return_only_ids = array_key_exists( 'return_only_ids', $params ) ? $params['return_only_ids'] : false;

	if ( ! $return_only_ids ) {
		$userddata = get_userdata( $post->post_author);
		$response->data['author_nicename'] = $userddata->user_nicename;
	}
	return $response;
}
add_filter( 'rest_prepare_geom_feature', 'geom_rest_prepare_geom_feature', 10, 3 );

?>