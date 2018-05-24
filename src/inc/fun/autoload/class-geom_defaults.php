<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

class Geom_defaults {


	protected $defaults = array();

	public function add_default( $arr ){
		$defaults = $this->defaults;
		$this->defaults = array_merge( $defaults , $arr);
	}
	
	public function get_default( $key ){
		if ( array_key_exists($key, $this->defaults) ){
			return $this->defaults[$key];

		}
			return null;
	}


}

function geom_init_defaults(){
	global $geom_defaults;
	
	$geom_defaults = new Geom_defaults();
	
	// $defaults = array(
	// 	// silence ...
	// );
	
	// $geom_defaults->add_default( $defaults );	
}
add_action( 'admin_init', 'geom_init_defaults', 1 );
add_action( 'init', 'geom_init_defaults', 1 );



?>