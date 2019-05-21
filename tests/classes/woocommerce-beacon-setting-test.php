<?php
/**
 * WooCommerce Yoast SEO plugin test file.
 *
 * @package WPSEO/WooCommerce/Tests
 */

/**
 * Unit tests.
 */
class WPSEO_WooCommerce_Beacon_Setting_Test extends WPSEO_WooCommerce_UnitTestCase {

	/**
	 * Instance of the class being tested.
	 *
	 * @var WPSEO_WooCommerce_Beacon_Setting
	 */
	protected $beacon_settings;

	/**
	 * Sets an instance of the WPSEO_WooCommerce_Beacon_Setting.
	 */
	public function setUp() {
		parent::setUp();

		$this->beacon_settings = new WPSEO_WooCommerce_Beacon_Setting();
	}

	/**
	 * Tests the situation where we get a non empty array when calling get_suggestions for the WooCommerce SEO page.
	 *
	 * @covers WPSEO_WooCommerce_Beacon_Setting::get_suggestions()
	 */
	public function test_get_suggestions_for_the_woocommerce_seo_page() {
		$result = $this->beacon_settings->get_suggestions( 'wpseo_woo' );

		$this->assertInternalType( 'array', $result );
		$this->assertNotEmpty( $result );
	}

	/**
	 * Tests the situation where an empty array is returned when calling get_suggestions for the WooCommerce SEO page.
	 *
	 * @covers WPSEO_WooCommerce_Beacon_Setting::get_suggestions()
	 */
	public function test_get_suggestions_for_a_non_woocommerce_seo_page() {
		$this->assertSame(
			array(),
			$this->beacon_settings->get_suggestions( 'wpseo_another_one' )
		);
	}

	/**
	 * Tests the situations where an array with the product will be returned on the WooCommerce SEO Page.
	 *
	 * @covers WPSEO_WooCommerce_Beacon_Setting::get_products()
	 */
	public function test_get_products_for_the_woocommerce_seo_page() {
		$expected = array( new Yoast_Product_WPSEO_WooCommerce() );
		$result   = $this->beacon_settings->get_products( 'wpseo_woo' );

		if ( method_exists( $this, 'assertContainsOnlyInstancesOf' ) ) {
			// The method assertContainsOnlyInstancesOf() was added in PHPUnit 4.x.
			$this->assertContainsOnlyInstancesOf( 'Yoast_Product_WPSEO_WooCommerce', $result );
		}

		$this->assertEquals( $expected, $result );
	}

	/**
	 * Tests the situations where an empty array will be returned on a non WooCommerce SEO Page.
	 *
	 * @covers WPSEO_WooCommerce_Beacon_Setting::get_products()
	 */
	public function test_get_products_for_a_non_woocommerce_seo_page() {
		$this->assertSame(
			array(),
			$this->beacon_settings->get_products( 'wpseo_another_page' )
		);
	}

	/**
	 * Tests the situations where an empty array will be returned.
	 *
	 * @covers WPSEO_WooCommerce_Beacon_Setting::get_config()
	 */
	public function test_get_config() {
		$this->assertSame(
			array(),
			$this->beacon_settings->get_config( 'wpseo_woo' )
		);
	}
}
