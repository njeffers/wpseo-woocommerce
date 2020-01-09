<?php
/**
 * WooCommerce Yoast SEO plugin.
 *
 * @package WPSEO/WooCommerce
 *
 * @wordpress-plugin
 * Plugin Name: Yoast SEO: WooCommerce
 * Version:     12.4.1
 * Plugin URI:  https://yoast.com/wordpress/plugins/yoast-woocommerce-seo/
 * Description: This extension to WooCommerce and Yoast SEO makes sure there's perfect communication between the two plugins.
 * Author:      Team Yoast
 * Author URI:  https://yoast.com
 * Depends:     Yoast SEO, WooCommerce
 * Text Domain: yoast-woo-seo
 * Domain Path: /languages/
 *
 * WC requires at least: 3.0
 * WC tested up to: 3.9
 *
 * Copyright 2014-2019 Yoast BV (email: support@yoast.com)
 */

if ( ! function_exists( 'add_filter' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

if ( file_exists( dirname( __FILE__ ) . '/vendor/autoload.php' ) ) {
	require dirname( __FILE__ ) . '/vendor/autoload.php';
}

/**
 * Initializes the plugin class, to make sure all the required functionality is loaded, do this after plugins_loaded.
 *
 * @since 1.0
 *
 * @return void
 */
function initialize_yoast_woocommerce_seo() {
	global $yoast_woo_seo;

	load_plugin_textdomain( 'yoast-woo-seo', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );

	// Initializes the plugin.
	$yoast_woo_seo = new Yoast_WooCommerce_SEO();
}

/**
 * Instantiate the plugin license manager for the current plugin and activate it's license.
 *
 * @codeCoverageIgnore
 *
 * @deprecated 10.1
 */
function yoast_woocommerce_seo_activate_license() {
	_deprecated_function( __FUNCTION__, '10.1' );
}

if ( ! wp_installing() ) {
	add_action( 'plugins_loaded', 'initialize_yoast_woocommerce_seo', 20 );
}
