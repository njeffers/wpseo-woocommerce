<?php

namespace Yoast\WP\Woocommerce\Tests\Classes;

use Brain\Monkey;
use Brain\Monkey\Functions;
use Mockery;
use Yoast\WP\Woocommerce\Tests\Doubles\Schema_Double;
use Yoast\WP\Woocommerce\Tests\Doubles\WPSEO_WooCommerce_Yoast_Tab_Double;
use Yoast\WP\Woocommerce\Tests\TestCase;

/**
 * Class WooCommerce_Schema_Test.
 */
class WooCommerce_Yoast_Tab_Test extends TestCase {

	/**
	 * Test our constructor.
	 *
	 * @covers WPSEO_WooCommerce_Yoast_Tab::__construct
	 */
	public function test_construct() {
		$instance = new \WPSEO_WooCommerce_Yoast_Tab();
		$this->assertTrue( has_filter( 'woocommerce_product_data_tabs', [ $instance, 'yoast_seo_tab' ] ) );
		$this->assertTrue( has_action( 'woocommerce_product_data_panels', [ $instance, 'add_yoast_seo_fields' ] ) );
		$this->assertTrue( has_action( 'save_post', [ $instance, 'save_data' ] ) );
	}

	/**
	 * Test adding our section to the Product Data section.
	 *
	 * @covers WPSEO_WooCommerce_Yoast_Tab::yoast_seo_tab
	 */
	public function test_yoast_seo_tab() {
		$instance = new \WPSEO_WooCommerce_Yoast_Tab();
		$expected = [
			'yoast_tab' => [
				'label'  => 'Yoast SEO',
				'class'  => 'yoast-seo',
				'target' => 'yoast_seo',
			],
		];
		$this->assertEquals( $expected, $instance->yoast_seo_tab( [] ) );
	}

	/**
	 * Test loading our view.
	 *
	 * @covers WPSEO_WooCommerce_Yoast_Tab::add_yoast_seo_fields
	 */
	public function test_add_yoast_seo_fields() {
		ob_start();

		define( 'WPSEO_WOO_PLUGIN_FILE', './wpseo-woocommerce.php' );
		Functions\stubs(
			[
				'get_the_ID'      => 123,
				'get_post_meta'   => 'gtin8',
				'plugin_dir_path' => './',
				'_e'              => null,
				'esc_attr'      => null,
				'esc_html_e'      => null,
			]
		);

		$instance = new \WPSEO_WooCommerce_Yoast_Tab();
		$instance->add_yoast_seo_fields();

		$output = ob_get_contents();
		ob_end_clean();

		$this->assertContains( 'yoast_seo[gtin8]', $output );
		$this->assertContains( '<div id="yoast_seo" class="panel woocommerce_options_panel">', $output );
	}

	/**
	 * Test our data validation.
	 *
	 * @covers WPSEO_WooCommerce_Yoast_Tab::validate_data
	 */
	public function test_validate_data() {
		Functions\stubs(
			[
				'wp_strip_all_tags' => function( $value ) {
					return strip_tags( $value );
				},
			]
		);

		$instance = new WPSEO_WooCommerce_Yoast_Tab_Double();
		$this->assertTrue( $instance->validate_data( '12345' ) );
		$this->assertFalse( $instance->validate_data( '12345<script>' ) );
		$this->assertFalse( $instance->validate_data( '' ) );
	}
}