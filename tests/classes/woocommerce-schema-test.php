<?php

namespace Yoast\Tests\Classes;

use \Yoast\Tests\TestCase;
use \WPSEO_WooCommerce_Schema;
use Brain\Monkey;

/**
 * Class WooCommerce_Schema_Test.
 *
 * @package Yoast\Tests\Classes
 */
class WooCommerce_Schema_Test extends TestCase {

	/**
	 * Tests a random test.
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

