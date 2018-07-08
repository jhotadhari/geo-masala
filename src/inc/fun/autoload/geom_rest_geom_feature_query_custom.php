<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Filter the query arguments for a post collection request
 *
 * add the 'geom_custom' args to query args if nonce is valid
 *
 */
function geom_feature_rest_query_custom( $args, $request ) {
	$query_params = $request->get_query_params();

	if ( ! isset( $query_params ) || empty( $query_params ) )
		return $args;

	$geom_custom = array_key_exists( 'geom_custom', $query_params ) && isset( $query_params['geom_custom'] ) && ! empty( $query_params['geom_custom'] ) ? $query_params['geom_custom'] : false;
	if ( ! $geom_custom )
		return $args;

	foreach ( $geom_custom as $arg_key => $arg_val ) {
		switch ( $arg_key ) {
			case 'author':
			case 'meta_query':
				$args[$arg_key] = $arg_val;
			default:
				// ...
		}
	}

	return $args;
}

add_filter( 'rest_geom_feature_query', 'geom_feature_rest_query_custom', 10, 2 );


?>