<?php
/**
 * WooCommerce Yoast SEO plugin test file.
 *
 * @package WPSEO/WooCommerce/Tests
 */

// Disable Xdebug backtrace.
if ( function_exists( 'xdebug_disable' ) ) {
	xdebug_disable();
}

echo 'Welcome to the WordPress SEO WooCommerce test suite' . PHP_EOL;
echo 'Version: 1.0' . PHP_EOL . PHP_EOL;

if ( false !== getenv( 'WP_PLUGIN_DIR' ) ) {
	define( 'WP_PLUGIN_DIR', getenv( 'WP_PLUGIN_DIR' ) );
}

$GLOBALS['wp_tests_options'] = array(
	'active_plugins' => array( 'wpseo-woocommerce/wpseo-woocommerce.php' ),
);

if ( false !== getenv( 'WP_DEVELOP_DIR' ) ) {
	require getenv( 'WP_DEVELOP_DIR' ) . 'tests/phpunit/includes/bootstrap.php';
}
else {
	require '../../../../tests/phpunit/includes/bootstrap.php';
}

// Load WordPress SEO.
require dirname( __FILE__ ) . '/../../wordpress-seo/wp-seo.php';

// Include unit test base class.
require_once dirname( __FILE__ ) . '/framework/woocommerce-unittestcase.php';
