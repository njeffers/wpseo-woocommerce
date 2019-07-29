<?php

namespace Yoast\WP\WooComerce\Tests\Classes;

use Yoast\WP\Woocommerce\Tests\TestCase;
use \WPSEO_WooCommerce_Schema;
use Brain\Monkey;

/**
 * Class WooCommerce_Schema_Test.
 */
class WooCommerce_Schema_Test extends TestCase {

	/**
	 * Tests that should_output_yoast_schema returns the right value.
	 *
	 * @covers WPSEO_WooCommerce_Schema::should_output_yoast_schema
	 */
	public function test_should_output_yoast_schema() {
		Monkey\Filters\expectApplied( 'wpseo_json_ld_output' )->once()->andReturn( true );

		$actual = WPSEO_WooCommerce_Schema::should_output_yoast_schema();
		$this->assertEquals( true, $actual );

		Monkey\Filters\expectApplied( 'wpseo_json_ld_output' )->once()->andReturn( false );

		$actual = WPSEO_WooCommerce_Schema::should_output_yoast_schema();
		$this->assertEquals( false, $actual );
	}
}

