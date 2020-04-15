<?php

namespace Yoast\WP\Woocommerce\Tests\Classes;

use Brain\Monkey\Functions;
use Mockery;
use WPSEO_WooCommerce_OpenGraph;
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

		$this->assertTrue( \has_filter( 'language_attributes', [ $og, 'product_namespace' ] ) );
		$this->assertTrue( \has_filter( 'wpseo_opengraph_type', [ $og, 'return_type_product' ] ) );
		$this->assertTrue( \has_filter( 'wpseo_opengraph_desc', [ $og, 'product_taxonomy_desc_enhancement' ] ) );
		$this->assertTrue( \has_action( 'wpseo_add_opengraph_additional_images', [ $og, 'set_opengraph_image' ] ) );
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
		$this->assertSame( 'product', $og->return_type_product( 'article' ) );

		Functions\stubs(
			[
				'is_singular' => false,
			]
		);
		$this->assertSame( 'article', $og->return_type_product( 'article' ) );
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
		$this->assertSame( 'example description', $og->product_taxonomy_desc_enhancement( 'example description' ) );

		$expected = 'This is our expected description';

		Functions\stubs(
			[
				'is_product_taxonomy' => true,
				'term_description'    => $expected,
				'wp_strip_all_tags'   => null,
				'strip_shortcodes'    => null,
			]
		);
		$this->assertSame( $expected, $og->product_taxonomy_desc_enhancement( 'example description' ) );
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
		$this->assertSame( $input, $og->product_namespace( $input ) );

		Functions\stubs(
			[
				'is_singular' => true,
			]
		);
		$this->assertSame( 'prefix="fn: https://yoast.com/bla product: http://ogp.me/ns/product#"', $og->product_namespace( $input ) );
	}

	/**
	 * Test setting the OpenGraph image.
	 *
	 * @covers WPSEO_WooCommerce_OpenGraph::set_opengraph_image
	 * @covers WPSEO_WooCommerce_OpenGraph::set_opengraph_image_product_category
	 */
	public function test_set_opengraph_image_product_category() {
		$og_image = Mockery::mock( 'alias:WPSEO_OpenGraph_Image' );
		$og_image->expects( 'add_image_by_id' )->once()->with( 123 );

		Functions\stubs(
			[
				'is_product_category'   => true,
				'get_term_meta'         => 123,
				'get_queried_object_id' => 12,
			]
		);

		$og = new WPSEO_WooCommerce_OpenGraph();
		$this->assertTrue( $og->set_opengraph_image( $og_image ) );
	}

	/**
	 * Test setting the OpenGraph image.
	 *
	 * @covers WPSEO_WooCommerce_OpenGraph::set_opengraph_image
	 * @covers WPSEO_WooCommerce_OpenGraph::set_opengraph_image_product_category
	 */
	public function test_set_opengraph_image_product_category_no_image() {
		$og_image = Mockery::mock( 'alias:WPSEO_OpenGraph_Image' );

		Functions\stubs(
			[
				'is_product_category'   => true,
				'get_term_meta'         => false,
				'get_queried_object_id' => 12,
			]
		);

		$og = new WPSEO_WooCommerce_OpenGraph();
		$this->assertFalse( $og->set_opengraph_image( $og_image ) );
	}

	/**
	 * Test setting the OpenGraph image.
	 *
	 * @covers WPSEO_WooCommerce_OpenGraph::set_opengraph_image
	 * @covers WPSEO_WooCommerce_OpenGraph::set_opengraph_image_product
	 */
	public function test_set_opengraph_image_product() {
		$og_image = Mockery::mock( 'alias:WPSEO_OpenGraph_Image' );
		$og_image->expects( 'add_image_by_id' )->times( 3 );

		$product = Mockery::mock( 'WC_Product' );
		$product->expects( 'get_gallery_image_ids' )->once()->andReturn( [ 1234, 1235, 1236 ] );

		Functions\stubs(
			[
				'is_product_category'   => false,
				'wc_get_product'        => $product,
				'get_queried_object_id' => 12,
			]
		);

		$og = new WPSEO_WooCommerce_OpenGraph();
		$this->assertTrue( $og->set_opengraph_image( $og_image ) );
	}

	/**
	 * Test setting the OpenGraph image.
	 *
	 * @covers WPSEO_WooCommerce_OpenGraph::set_opengraph_image
	 * @covers WPSEO_WooCommerce_OpenGraph::set_opengraph_image_product
	 */
	public function test_set_opengraph_image_product_no_image() {
		$og_image = Mockery::mock( 'alias:WPSEO_OpenGraph_Image' );

		$product = Mockery::mock( 'WC_Product' );
		$product->expects( 'get_gallery_image_ids' )->once()->andReturn( [] );

		Functions\stubs(
			[
				'is_product_category'   => false,
				'wc_get_product'        => $product,
				'get_queried_object_id' => 12,
			]
		);

		$og = new WPSEO_WooCommerce_OpenGraph();
		$this->assertFalse( $og->set_opengraph_image( $og_image ) );
	}

	/**
	 * Test setting the OpenGraph image when there is no product.
	 *
	 * @covers WPSEO_WooCommerce_OpenGraph::set_opengraph_image
	 */
	public function test_set_opengraph_image_no_product() {
		$og_image = Mockery::mock( 'alias:WPSEO_OpenGraph_Image' );

		Functions\stubs(
			[
				'is_product_category'   => false,
				'wc_get_product'        => false,
				'get_queried_object_id' => 12,
			]
		);

		$og = new WPSEO_WooCommerce_OpenGraph();
		$this->assertFalse( $og->set_opengraph_image( $og_image ) );
	}

	/**
	 * Test setting the OpenGraph image when there are no image.
	 *
	 * @covers WPSEO_WooCommerce_OpenGraph::set_opengraph_image
	 */
	public function test_set_opengraph_image_no_image() {
		$og_image = Mockery::mock( 'alias:WPSEO_OpenGraph_Image' );

		$product = Mockery::mock( 'WC_Product' );
		$product->expects( 'get_gallery_image_ids' )->once()->andReturn( [] );

		Functions\stubs(
			[
				'is_product_category'   => false,
				'wc_get_product'        => $product,
				'get_queried_object_id' => 12,
			]
		);

		$og = new WPSEO_WooCommerce_OpenGraph();
		$this->assertFalse( $og->set_opengraph_image( $og_image ) );
	}
}
