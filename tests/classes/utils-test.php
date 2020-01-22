<?php

namespace Yoast\WP\Woocommerce\Tests\Classes;

use Brain\Monkey;
use Brain\Monkey\Functions;
use Mockery;
use WPSEO_WooCommerce_Utils;
use Yoast\WP\Woocommerce\Tests\TestCase;

/**
 * Class WooCommerce_Schema_Test.
 */
class Utils_Test extends TestCase {

	/**
	 * Test retrieving a primary term.
	 *
	 * @covers WPSEO_WooCommerce_Utils::search_primary_term
	 */
	public function test_search_primary_term() {
		$product_id = 123;

		$product = Mockery::mock( 'WC_Product' )->makePartial();
		$product->expects( 'get_id' )->once()->andReturn( $product_id );

		$primary_term_mock = Mockery::mock( 'overload:WPSEO_Primary_Term' );
		$primary_term_mock->expects( '__construct' )->once()->with( 'brand', $product_id )->andReturnSelf();
		$primary_term_mock->expects( 'get_primary_term' )->once()->with()->andReturn( 12345 );

		Functions\stubs(
			[
				'get_term_by' => (object) [ 'name' => 'Apple' ],
			]
		);

		$this->assertEquals( 'Apple', WPSEO_WooCommerce_Utils::search_primary_term( [ 'brand' ], $product ) );
	}

	/**
	 * Test retrieving a primary term.
	 *
	 * @covers WPSEO_WooCommerce_Utils::search_primary_term
	 */
	public function test_search_primary_term_find_none() {
		$product_id = 123;

		$product = Mockery::mock( 'WC_Product' )->makePartial();
		$product->expects( 'get_id' )->once()->andReturn( $product_id );

		$primary_term_mock = Mockery::mock( 'overload:WPSEO_Primary_Term' );
		$primary_term_mock->expects( '__construct' )->once()->with( 'brand', $product_id )->andReturnSelf();
		$primary_term_mock->expects( 'get_primary_term' )->once()->with()->andReturn( false );

		$this->assertEquals( '', WPSEO_WooCommerce_Utils::search_primary_term( [ 'brand' ], $product ) );
	}

	/**
	 * Test getting the product display price
	 *
	 * @covers WPSEO_WooCommerce_Utils::get_product_display_price
	 */
	public function test_get_product_display_price() {
		$price    = 10;
		$tax_rate = 1.1;

		$product = Mockery::mock( 'WC_Product' )->makePartial();
		$product->expects( 'get_price' )->once()->andReturn( $price );
		$product->expects( 'get_min_purchase_quantity' )->once()->andReturn( 1 );

		$options = Mockery::mock( 'alias:WPSEO_Options' )->makePartial();
		$options->expects( 'get' )->once()->with( 'woo_schema_og_prices_with_tax' )->andReturn( true );

		Functions\stubs(
			[
				'wc_get_price_decimals'      => 2,
				'wc_tax_enabled'             => true,
				'wc_prices_include_tax'      => false,
				'wc_format_decimal'          => function ( $number, $decimals ) {
					return number_format( $number, $decimals );
				},
				'wc_get_price_including_tax' => function ( $product, $args ) {
					return ( $args['price'] * 1.1 );
				},
			]
		);

		$this->assertEquals( ( $price * $tax_rate ), WPSEO_WooCommerce_Utils::get_product_display_price( $product ) );
	}
}
