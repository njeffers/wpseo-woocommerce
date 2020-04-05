<?php

namespace Yoast\WP\Woocommerce\Tests\Classes;

use Mockery;
use WPSEO_Woocommerce_Permalink_Watcher;
use Yoast\WP\Woocommerce\Tests\TestCase;

/**
 * Class WooCommerce_Schema_Test.
 *
 * @coversDefaultClass \WPSEO_Woocommerce_Permalink_Watcher
 */
class Permalink_Watcher_Test extends TestCase {

	/**
	 * Instance of the WooCommerce Permalink Watcher.
	 *
	 * @var \WPSEO_Woocommerce_Permalink_Watcher|Mockery\MockInterface
	 */
	protected $instance;

	/**
	 * Setup the things we needed for testing.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = Mockery::mock( WPSEO_Woocommerce_Permalink_Watcher::class )
			->shouldAllowMockingProtectedMethods()
			->makePartial();
	}

	/**
	 * Filters the product from the post types.
	 *
	 * @covers ::filter_product_from_post_types
	 */
	public function test_filter_product_from_post_types() {
		$this->assertEquals(
			[
				'post' => 'post',
				'page' => 'page',
			],
			$this->instance->filter_product_from_post_types(
				[
					'post'    => 'post',
					'page'    => 'page',
					'product' => 'product',
				]
			)
		);
	}

	/**
	 * Tests resetting the product on product_base change.
	 *
	 * @covers ::reset_woocommerce_permalinks
	 */
	public function test_reset_woocommerce_permalinks_product_base() {
		$this->instance
			->expects( 'reset_permalink_indexables' )
			->once()
			->with( 'post', 'product' );

		$old = [
			'product_base' => 'bar',
		];
		$new = [
			'product_base' => 'foo',
		];

		$this->instance->reset_woocommerce_permalinks( $old, $new );
	}

	/**
	 * Tests resetting the product on product_base change.
	 *
	 * @covers ::reset_woocommerce_permalinks
	 */
	public function test_reset_woocommerce_permalinks_attribute_base() {
		$this->instance
			->expects( 'reset_permalink_indexables' )
			->once()
			->with( 'term', 'my_attribute' );

		$this->instance
			->expects( 'get_attribute_taxonomies' )
			->once()
			->andReturn( [ 'my_attribute' ] );

		$old = [
			'attribute_base' => 'bar',
		];
		$new = [
			'attribute_base' => 'foo',
		];

		$this->instance->reset_woocommerce_permalinks( $old, $new );
	}

	/**
	 * Tests resetting the product on product_base change.
	 *
	 * @covers ::reset_woocommerce_permalinks
	 */
	public function test_reset_woocommerce_permalinks_terms_base() {
		$this->instance
			->expects( 'reset_permalink_indexables' )
			->once()
			->with( 'term', 'product_cat' );

		$this->instance
			->expects( 'reset_permalink_indexables' )
			->once()
			->with( 'term', 'product_tag' );

		$old = [
			'category_base' => 'bar',
			'tag_base'      => 'bar',
			'no_base'       => 'bar',
		];
		$new = [
			'category_base' => 'foo',
			'tag_base'      => 'foo',
			'no_base'       => 'foo',
		];

		$this->instance->reset_woocommerce_permalinks( $old, $new );
	}
}
