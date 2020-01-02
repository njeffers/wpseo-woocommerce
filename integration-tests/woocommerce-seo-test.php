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

		WPSEO_Options::set( 'woo_hide_columns', true );

		$actual   = $woocommerce->column_heading(
			[
				'wpseo-title'    => '',
				'another-column' => '',
				'wpseo-focuskw'  => '',
			]
		);
		$expected = [ 'another-column' => '' ];

		$this->assertSame( $expected, $actual );
	}

	/**
	 * Tests the check dependencies function.
	 *
	 * @dataProvider check_dependencies_data
	 *
	 * @param bool   $expected              The expected value.
	 * @param string $wordpress_seo_version The WordPress SEO version to check.
	 * @param string $wordpress_version     The WordPress version to check.
	 * @param string $message               Message given by PHPUnit after assertion.
	 *
	 * @covers Yoast_WooCommerce_SEO::check_dependencies
	 */
	public function test_check_dependencies( $expected, $wordpress_seo_version, $wordpress_version, $message ) {
		$class_instance = $this
			->getMockBuilder( 'Yoast_WooCommerce_SEO_Double' )
			->disableOriginalConstructor()
			->setMethods( [ 'get_wordpress_seo_version' ] )
			->getMock();

		$class_instance
			->expects( $this->any() )
			->method( 'get_wordpress_seo_version' )
			->will( $this->returnValue( $wordpress_seo_version ) );


		$this->assertSame( $expected, $class_instance->check_dependencies( $wordpress_version ), $message );
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

	/**
	 * Data provider for the check dependencies test.
	 *
	 * [0]: Expected
	 * [1]: WordPress SEO Version
	 * [2]: WordPress Version
	 * [3]: Message for PHPUnit.
	 *
	 * @return array
	 */
	public function check_dependencies_data() {
		return [
			[ false, '12.7', '3.0', 'WordPress is below the minimal required version.' ],
			[ false, '12.7', '5.1', 'WordPress is below the minimal required version.' ],
			[ false, false, '5.3', 'WordPress SEO is not installed.' ],
			[ false, '8.1', '5.1', 'WordPress SEO is below the minimal required version.' ],
			[ true, '12.6-RC1', '5.2', 'WordPress and WordPress SEO have the minimal required versions.' ],
			[ true, '12.7', '5.3', 'WordPress and WordPress SEO have the minimal required versions.' ],
		];
	}
}
