<?php

namespace Yoast\WP\Woocommerce\Tests\Classes;

use Brain\Monkey;
use Brain\Monkey\Functions;
use Mockery;
use WPSEO_WooCommerce_OpenGraph;
use Yoast\WP\Woocommerce\Tests\Doubles\OpenGraph_Double;
use Yoast\WP\Woocommerce\Tests\TestCase;

/**
 * Class WooCommerce_Schema_Test.
 */
class OpenGraph_Test extends TestCase {

	/**
	 * Test that our constructor works.
	 *
	 * @covers WPSEO_WooCommerce_OpenGraph::__construct
	 */
	public function test_construct() {
		$og = new WPSEO_WooCommerce_OpenGraph();

		$this->assertTrue( has_filter( 'language_attributes', [ $og, 'product_namespace' ] ) );
		$this->assertTrue( has_filter( 'wpseo_opengraph_type', [ $og, 'return_type_product' ] ) );
		$this->assertTrue( has_filter( 'wpseo_opengraph_desc', [ $og, 'product_taxonomy_desc_enhancement' ] ) );
		$this->assertTrue( has_action( 'wpseo_opengraph', [ $og, 'product_enhancement' ] ) );
		$this->assertTrue( has_action( 'wpseo_add_opengraph_additional_images', [ $og, 'set_opengraph_image' ] ) );
	}

	/**
	 * Test that our constructor works.
	 *
	 * @covers WPSEO_WooCommerce_OpenGraph::return_type_product
	 */
	public function test_return_type_product() {
		Functions\stubs(
			[
				'is_singular' => true,
			]
		);

		$og = new WPSEO_WooCommerce_OpenGraph();
		$this->assertEquals( 'product', $og->return_type_product( 'article' ) );

		Functions\stubs(
			[
				'is_singular' => false,
			]
		);
		$this->assertEquals( 'article', $og->return_type_product( 'article' ) );
	}

	/**
	 * Test the OpenGraph description enhancement.
	 *
	 * @covers WPSEO_WooCommerce_OpenGraph::product_taxonomy_desc_enhancement
	 */
	public function test_product_taxonomy_desc_enhancement() {
		Functions\stubs(
			[
				'is_product_taxonomy' => false,
			]
		);

		$og = new WPSEO_WooCommerce_OpenGraph();
		$this->assertEquals( 'example description', $og->product_taxonomy_desc_enhancement( 'example description' ) );

		$expected = 'This is our expected description';

		Functions\stubs(
			[
				'is_product_taxonomy' => true,
				'term_description'    => $expected,
				'wp_strip_all_tags'   => null,
				'strip_shortcodes'    => null,
			]
		);
		$this->assertEquals( $expected, $og->product_taxonomy_desc_enhancement( 'example description' ) );
	}

	/**
	 * Test the OpenGraph enhancement.
	 *
	 * @covers WPSEO_WooCommerce_OpenGraph::product_namespace
	 */
	public function test_product_namespace() {
		$og = new WPSEO_WooCommerce_OpenGraph();

		Functions\stubs(
			[
				'is_singular' => false,
			]
		);

		$input = 'prefix="fn: https://yoast.com/bla"';
		$this->assertEquals( $input, $og->product_namespace( $input ) );

		Functions\stubs(
			[
				'is_singular' => true,
			]
		);
		$this->assertEquals( 'prefix="fn: https://yoast.com/bla product: http://ogp.me/ns/product#"', $og->product_namespace( $input ) );
	}

	/**
	 * Test OpenGraph price enhancement.
	 *
	 * @covers WPSEO_WooCommerce_OpenGraph::price
	 */
	public function test_price() {
		Functions\stubs(
			[
				'apply_filters_deprecated' => true,
				'apply_filters'            => true,
				'esc_attr'                 => null,
				'get_woocommerce_currency' => 'USD',
			]
		);

		$product = Mockery::mock( 'WC_Product' );
		$product->expects( 'get_price' )->once()->andReturn( '54' );

		$og = new OpenGraph_Double();

		ob_start();
		$og->price( $product );

		$expected = '<meta property="product:price:amount" content="54" />' . "\n"
		            . '<meta property="product:price:currency" content="USD" />' . "\n";
		$this->assertEquals( $expected, ob_get_clean() );
	}

	/**
	 * Test the OpenGraph brand enhancement.
	 *
	 * @covers WPSEO_WooCommerce_OpenGraph::brand
	 * @covers WPSEO_WooCommerce_OpenGraph::get_brand_term_name
	 */
	public function test_brand() {
		$product = Mockery::mock( 'WC_Product' )->makePartial();

		$options = Mockery::mock( 'alias:WPSEO_Options' )->makePartial();
		$options->expects( 'get' )->once()->with( 'woo_schema_brand' )->andReturn( 'brand' );

		Functions\stubs(
			[
				'wc_get_product'        => $product,
				'get_queried_object_id' => 1,
				'get_the_ID'            => 1,
				'wp_strip_all_tags'     => null,
				'strip_shortcodes'      => null,
				'get_the_terms'         => [ 'Apple' => (object) [ 'name' => 'Apple' ] ],
			]
		);

		$og = new OpenGraph_Double();
		ob_start();
		$og->brand( $product );

		$this->assertEquals( '<meta property="product:brand" content="Apple"/>' . "\n", ob_get_clean() );
	}

	/**
	 * Test the OpenGraph product condition enhancement.
	 *
	 * @covers WPSEO_WooCommerce_OpenGraph::product_condition
	 */
	public function test_product_condition() {
		$product = Mockery::mock( 'WC_Product' )->makePartial();

		Functions\stubs(
			[
				'apply_filters' => 'used',
				'esc_attr'      => null,
			]
		);

		$og = new OpenGraph_Double();
		ob_start();
		$og->product_condition( $product );

		$this->assertEquals( '<meta property="product:condition" content="used" />' . "\n", ob_get_clean() );
	}

	/**
	 * Test the OpenGraph retailer item ID enhancement.
	 *
	 * @covers WPSEO_WooCommerce_OpenGraph::retailer_item_id
	 */
	public function test_retailer_item_id() {
		$product = Mockery::mock( 'WC_Product' )->makePartial();
		$product->expects( 'get_sku' )->andReturn( 'sku123' );

		Functions\stubs(
			[
				'esc_attr'      => null,
			]
		);

		$og = new OpenGraph_Double();
		ob_start();
		$og->retailer_item_id( $product );

		$this->assertEquals( '<meta property="product:retailer_item_id" content="sku123" />' . "\n", ob_get_clean() );
	}

	/**
	 * Test the OpenGraph in stock enhancement.
	 *
	 * @covers WPSEO_WooCommerce_OpenGraph::in_stock
	 */
	public function test_in_stock() {
		$product = Mockery::mock( 'WC_Product' )->makePartial();
		$product->expects( 'is_in_stock' )->andReturn( true );

		$og = new OpenGraph_Double();
		ob_start();
		$og->in_stock( $product );

		$this->assertEquals( '<meta property="product:availability" content="in stock" />' . "\n", ob_get_clean() );
	}

	/**
	 * Get brand term name test.
	 *
	 * @covers WPSEO_WooCommerce_OpenGraph::get_brand_term_name
	 *
	 * @runInSeparateProcess
	 */
	public function test_get_brand_term_name() {
		$product = Mockery::mock( 'WC_Product' )->makePartial();
		$product->expects( 'get_id' )->once()->andReturn( 123 );

		$taxonomy = 'brand';

		$primary_term = Mockery::mock( 'WPSEO_Primary_Term' )->makePartial();
		$primary_term->expects( '__construct' )->once()->with( [ $taxonomy, $product->get_id() ] )->andReturn( '12345' );
		$primary_term->expects( 'get_primary_term' )->once()->andReturn( '12345' );
//		$woo_seo = Mockery::mock( 'alias:WPSEO_WooCommerce_Utils' )->makePartial();
//		$woo_seo->expects( 'search_primary_term' )->once()->with( ['brand'], $product )->andReturn( 'Apple' );

		$og = new OpenGraph_Double();
		$this->assertEquals( 'Apple', $og->get_brand_term_name( 'brand', $product ) );
	}
}
