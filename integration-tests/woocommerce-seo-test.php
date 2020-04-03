<?php
/**
 * WooCommerce Yoast SEO plugin test file.
 *
 * @package WPSEO/WooCommerce/Tests
 */

/**
 * Unit tests.
 */
class Yoast_WooCommerce_SEO_Test extends WPSEO_WooCommerce_UnitTestCase {

	/**
	 * Tests the filtering of Yoast SEO columns.
	 *
	 * @covers Yoast_WooCommerce_SEO::column_heading
	 */
	public function test_column_heading() {
		WPSEO_Option_Woo::register_option();

		$woocommerce = new Yoast_WooCommerce_SEO();

		$columns = [
			'another-column'          => '',
			'wpseo-title'             => '',
			'wpseo-metadesc'          => '',
			'wpseo-focuskw'           => '',
			'wpseo-score'             => '',
			'wpseo-score-readability' => '',
		];

		if ( class_exists( 'WPSEO_Link_Columns' ) ) {
			$columns += [
				'wpseo-' . WPSEO_Link_Columns::COLUMN_LINKS  => '',
				'wpseo-' . WPSEO_Link_Columns::COLUMN_LINKED => '',
			];
		}

		$actual = $woocommerce->column_heading( $columns );

		$expected = [
			'another-column' => '',
			'wpseo-score'    => '',
		];

		$this->assertSame( $expected, $actual );
	}

	/**
	 * Tests the sitemap filtering of a product that is not hidden.
	 *
	 * @covers Yoast_WooCommerce_SEO::filter_hidden_product
	 */
	public function test_filter_hidden_product_for_product_that_is_visible() {
		$product = self::factory()->post->create_and_get(
			[
				'post_type' => 'product',
			]
		);

		$instance = $this
			->getMockBuilder( 'Yoast_WooCommerce_SEO_Double' )
			->disableOriginalConstructor()
			->setMethods( [ 'excluded_from_catalog' ] )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'excluded_from_catalog' )
			->will( $this->returnValue( [] ) );

		$this->assertSame(
			[ 'loc' => 'http://shop.site/product' ],
			$instance->filter_hidden_product( [ 'loc' => 'http://shop.site/product' ], 'post', $product )
		);
	}

	/**
	 * Tests the sitemap filtering of a product that is hidden from the catalog.
	 *
	 * @covers Yoast_WooCommerce_SEO::filter_hidden_product
	 */
	public function test_filter_hidden_product_for_product_that_is_hidden() {
		$product = self::factory()->post->create_and_get(
			[
				'post_type' => 'product',
			]
		);

		$instance = $this
			->getMockBuilder( 'Yoast_WooCommerce_SEO_Double' )
			->disableOriginalConstructor()
			->setMethods( [ 'excluded_from_catalog' ] )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'excluded_from_catalog' )
			->will( $this->returnValue( [ $product->ID ] ) );

		$this->assertFalse(
			$instance->filter_hidden_product( [ 'loc' => 'http://shop.site/product' ], 'post', $product )
		);
	}

	/**
	 * Tests the sitemap filtering of a product that is not a product
	 *
	 * @covers Yoast_WooCommerce_SEO::filter_hidden_product
	 */
	public function test_filter_hidden_product_for_a_non_product() {
		$product = self::factory()->post->create_and_get(
			[
				'post_type' => 'post',
			]
		);

		$instance = $this
			->getMockBuilder( 'Yoast_WooCommerce_SEO_Double' )
			->disableOriginalConstructor()
			->setMethods( [ 'excluded_from_catalog' ] )
			->getMock();

		$instance
			->expects( $this->never() )
			->method( 'excluded_from_catalog' );

		$this->assertSame(
			[ 'loc' => 'http://shop.site/product' ],
			$instance->filter_hidden_product( [ 'loc' => 'http://shop.site/product' ], 'post', $product )
		);
	}

	/**
	 * Tests the sitemap filtering of a product when a invalid post object is given.
	 *
	 * @covers Yoast_WooCommerce_SEO::filter_hidden_product
	 */
	public function test_filter_hidden_product_when_invalid_post_object_is_given() {
		$instance = $this
			->getMockBuilder( 'Yoast_WooCommerce_SEO_Double' )
			->disableOriginalConstructor()
			->setMethods( [ 'excluded_from_catalog' ] )
			->getMock();

		$instance
			->expects( $this->never() )
			->method( 'excluded_from_catalog' );

		$this->assertSame(
			[ 'loc' => 'http://shop.site/product' ],
			$instance->filter_hidden_product( [ 'loc' => 'http://shop.site/product' ], 'post', null )
		);
	}

	/**
	 * Tests the sitemap filtering when no url loc is given to the url data.
	 *
	 * @covers Yoast_WooCommerce_SEO::filter_hidden_product
	 */
	public function test_filter_hidden_product_when_no_url_loc_is_present() {
		$instance = $this
			->getMockBuilder( 'Yoast_WooCommerce_SEO_Double' )
			->disableOriginalConstructor()
			->setMethods( [ 'excluded_from_catalog' ] )
			->getMock();

		$instance
			->expects( $this->never() )
			->method( 'excluded_from_catalog' );

		$this->assertSame(
			[ 'no-loc' => 'http://shop.site/product' ],
			$instance->filter_hidden_product( [ 'no-loc' => 'http://shop.site/product' ], 'post', null )
		);
	}
}
