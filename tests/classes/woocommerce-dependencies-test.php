<?php

namespace Yoast\WP\Woocommerce\Tests\Classes;

use Brain\Monkey;
use Brain\Monkey\Functions;
use Mockery;
use Yoast\WP\Woocommerce\Tests\Doubles\Yoast_WooCommerce_Dependencies_Double;
use Yoast\WP\Woocommerce\Tests\TestCase;
use Yoast_WooCommerce_SEO;

/**
 * Class WooCommerce_Schema_Test.
 */
class Yoast_WooCommerce_Dependencies_Test extends TestCase {
	/**
	 * @covers Yoast_WooCommerce_Dependencies::check_dependencies
	 * @covers Yoast_WooCommerce_Dependencies::get_wordpress_seo_version
	 * @covers Yoast_WooCommerce_Dependencies::check_woocommerce_exists
	 */
	public function test_check_dependencies() {
		$valid_wp_version        = '5.2';
		$valid_yoast_seo_version = '12.6-RC0';

		$class = Mockery::mock( Yoast_WooCommerce_Dependencies_Double::class )->makePartial();

		// Invalid WordPress version
		$actual = $class->check_dependencies( '5.0' );
		$this->assertFalse( $actual );

		// Valid WordPress version
		$class->expects( 'check_woocommerce_exists' )->once()->andReturn( true );
		$class->expects( 'get_wordpress_seo_version' )->once()->andReturn( $valid_yoast_seo_version );
		$actual = $class->check_dependencies( '5.2' );
		$this->assertTrue( $actual );

		// WooCommerce in-active.
		$class->expects( 'check_woocommerce_exists' )->once()->andReturn( false );
		$actual = $class->check_dependencies( $valid_wp_version );
		$this->assertFalse( $actual );

		// WooCommerce active.
		$class->expects( 'check_woocommerce_exists' )->once()->andReturn( true );
		$class->expects( 'get_wordpress_seo_version' )->once()->andReturn( $valid_yoast_seo_version );
		$actual = $class->check_dependencies( $valid_wp_version );
		$this->assertTrue( $actual );

		// No Yoast SEO.
		$class->expects( 'check_woocommerce_exists' )->once()->andReturn( true );
		$class->expects( 'get_wordpress_seo_version' )->once()->andReturn( false );
		$actual = $class->check_dependencies( $valid_wp_version );
		$this->assertFalse( $actual );

		// Wrong Yoast SEO version.
		$class->expects( 'check_woocommerce_exists' )->once()->andReturn( true );
		$class->expects( 'get_wordpress_seo_version' )->once()->andReturn( '12.5' );
		$actual = $class->check_dependencies( $valid_wp_version );
		$this->assertFalse( $actual );

		// Correct Yoast SEO version.
		$class->expects( 'check_woocommerce_exists' )->once()->andReturn( true );
		$class->expects( 'get_wordpress_seo_version' )->once()->andReturn( $valid_yoast_seo_version );
		$actual = $class->check_dependencies( $valid_wp_version );
		$this->assertTrue( $actual );
	}

}
