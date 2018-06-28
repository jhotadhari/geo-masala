<?php 
/*
Plugin Name: Geo Masala
Plugin URI: https://github.com/jhotadhari/geo-masala
Description: Add interactive Leaflet Maps. A new block for gutenberg: 'Geo Masala Map'
Version: 0.0.4
Author: jhotadhari
Author URI: https://waterproof-webdesign.info
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Text Domain: geo-masala
Domain Path: /languages
Tags: gutenberg,leaflet,map,geo,gis
*/

?><?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

class Geom_Geo_masala {

	protected static $instance = null;
	const VERSION = '0.0.3';
	const DB_VERSION = 0;			// int	increase the number if the database needs an update
	const PLUGIN_SLUG = 'geo-masala';
	const PLUGIN_NAME = 'Geo Masala';
	const PLUGIN_PREFIX = 'geom';
	protected $deactivate_notice = '';
	protected $deps = array(
		'plugins' => array(),
		'php_version' => '5.6',		// required php version
		'wp_version' => '4.7',			// required wp version
		'php_ext' => array(),
	);
	protected $dependencies_ok = false;

	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
			self::$instance->hooks();
		}
		return self::$instance;
	}

	public function hooks() {
		register_activation_hook( __FILE__, array( $this, 'on_activate' ) );
		register_deactivation_hook( __FILE__, array( $this, 'on_deactivate' ) );
		register_uninstall_hook( __FILE__, array( __CLASS__, 'on_uninstall' ) );
		add_action( 'plugins_loaded', array( $this, 'start_plugin' ), 9 );
	}

	public static function plugin_dir_url(){
		return plugins_url( '', __FILE__ );		// no trailing slash
	}

	public static function plugin_dir_path(){
		return plugin_dir_path( __FILE__ );		// trailing slash
	}

	public static function plugin_dir_basename(){
		return basename( dirname( __FILE__ ) );	// no trailing slash
	}

	public static function plugin_file(){
		return __FILE__;						// plugin file abs path
	}


	public function start_plugin() {
		if ( $this->check_dependencies() ){
			add_action( 'plugins_loaded', array( $this, 'load_textdomain' ) );
			$this->register_post_types_and_taxs();
			$this->maybe_update();	// I think mass a plugin update does not run activation hooks
			add_action( 'plugins_loaded', array( $this, 'include_inc_dep_autoload' ) );
			add_action( 'plugins_loaded', array( $this, 'include_inc_fun_autoload' ) );
			do_action('geom_plugin_loaded');
		} else {
			add_action( 'admin_init', array( $this, 'deactivate' ) );
		}

	}

	public function on_activate() {
		if ( $this->check_dependencies() ){
			$this->init_options();
			$this->register_post_types_and_taxs();
			$this->add_roles_and_capabilities();
			// hook the register post type functions, because init is to late
			do_action('geom_on_activate_before_flush');
			flush_rewrite_rules();
			$this->maybe_update();
			do_action('geom_plugin_activated');
		} else {
			add_action( 'admin_init', array( $this, 'deactivate' ) );
			wp_die(
				$this->deactivate_notice
				. '<p>The plugin will not be activated.</p>'
				. '<p><a href="' . admin_url( 'plugins.php' ) . '">&laquo; Return to Plugins</a></p>'
			);
		}
	}

	public function on_deactivate() {
		$this->add_roles_and_capabilities();
		do_action('geom_on_deactivate_before_flush');
		flush_rewrite_rules();
		do_action('geom_plugin_deactivated');
	}

	public static function on_uninstall() {
		do_action('geom_plugin_uninstalled');
	}

	protected function check_dependencies(){
		$error_msgs = array();

		// check php version
		if ( version_compare( PHP_VERSION, $this->deps['php_version'], '<') ){
			$err_msg = sprintf( 'PHP version %s or higher', $this->deps['php_version'] );
			array_push( $error_msgs, $err_msg );
		}

		// check php extensions
		if ( array_key_exists( 'php_ext', $this->deps ) && is_array( $this->deps['php_ext'] ) ){
			foreach ( $this->deps['php_ext'] as $php_ext_key => $php_ext_val ){
				if ( ! extension_loaded( $php_ext_key ) ) {
					$err_msg = sprintf( '<a href="%s" target="_blank">%s</a> php extension to be installed', $php_ext_val['link'], $php_ext_val['name'] );
					array_push( $error_msgs, $err_msg );
				}
			}
		}

		// check wp version
		// include an unmodified $wp_version
		include( ABSPATH . WPINC . '/version.php' );
		if ( version_compare( $wp_version, $this->deps['wp_version'], '<') ){
			$err_msg = sprintf( 'WordPress version %s or higher', $this->deps['wp_version'] );
			array_push( $error_msgs, $err_msg );
		}

		// check plugin dependencies
		if ( array_key_exists( 'plugins', $this->deps ) && is_array( $this->deps['plugins'] ) ){
			foreach ( $this->deps['plugins'] as $dep_plugin ){
				$err_msg = sprintf( ' <a href="%s" target="_blank">%s</a> Plugin version %s (tested up to %s)', $dep_plugin['link'], $dep_plugin['name'], $dep_plugin['ver_at_least'], $dep_plugin['ver_tested_up_to']);
				// check by class
				if ( array_key_exists( 'class', $dep_plugin ) && strlen( $dep_plugin['class'] ) > 0 ){
					if ( ! class_exists( $dep_plugin['class'] ) ) {
						array_push( $error_msgs, $err_msg );
					}
				}
				// check by function
				if ( array_key_exists( 'function', $dep_plugin ) && strlen( $dep_plugin['function'] ) > 0 ){
					if ( ! function_exists( $dep_plugin['function'] ) ) {
						array_push( $error_msgs, $err_msg);
					}
				}
			}
		}

		// maybe set deactivate_notice and deactivate plugin
		if ( count( $error_msgs ) > 0 ){
			$this->deactivate_notice =
				'<h3>' . self::PLUGIN_NAME . ' plugin requires:</h3>'
				. '<ul style="padding-left: 1em; list-style: inside disc;"><li>' . implode ( '</li><li>' , $error_msgs ) . '</li></ul>';
			return false;
		}

		return true;
	}

	public function deactivate() {
		add_action( 'admin_notices', array( $this, 'the_deactivate_notice' ) );
		deactivate_plugins( plugin_basename( __FILE__ ) );
	}

	public function the_deactivate_notice(){
		echo '<div class="notice error">' . $this->deactivate_notice . '<p>The plugin will be deactivated.</p>' . '</div>';
	}

	protected function init_options() {
		update_option( 'geom_version', self::VERSION );
		add_option( 'geom_db_version', self::DB_VERSION );
	}

	// include files to register post types and taxonomies
	protected function register_post_types_and_taxs() {
		self::include_dir( self::plugin_dir_path() . 'inc/post_types_taxs/autoload/' );
	}

	// include files to add user roles and capabilities
	protected function add_roles_and_capabilities() {
		self::include_dir( self::plugin_dir_path() . 'inc/roles_capabilities/autoload/' );
	}

	// check DB_VERSION and require the update class if necessary
	protected function maybe_update() {
		if ( get_option( 'geom_db_version' ) < self::DB_VERSION ) {
			// require_once( self::plugin_dir_path() . 'inc/dep/class-geom-update.php' );
			// new Geom_Update();
			// class Geom_Update()  is missing ??? !!!
		}
	}

	public function load_textdomain(){
		load_plugin_textdomain(
			'geo-masala',
			false,
			self::plugin_dir_basename() . '/languages'
		);
	}

	public function include_inc_dep_autoload() {
		self::include_dir(  self::plugin_dir_path() . 'inc/dep/autoload/' );
	}

	public function include_inc_fun_autoload() {
		self::include_dir(  self::plugin_dir_path() . 'inc/fun/autoload/' );
	}

	public static function rglob( $pattern, $flags = 0) {
		$files = glob( $pattern, $flags );
		foreach ( glob( dirname( $pattern ).'/*', GLOB_ONLYDIR|GLOB_NOSORT) as $dir ) {
			$files = array_merge( $files, self::rglob( $dir.'/'.basename( $pattern ), $flags ) );
		}
		return $files;
	}

	public static function include_dir( $directory ){
		$files =  self::rglob( $directory . '*.php');
		if ( count($files) > 0 ){
			foreach ( $files as $file) {
				include_once( $file );
			}
		}
	}

}

function geom_geo_masala_init() {
	return Geom_Geo_masala::get_instance();
}
geom_geo_masala_init();

?>