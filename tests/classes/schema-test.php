<?php

namespace Yoast\WP\WooComerce\Tests\Classes;

use Brain\Monkey;
use Mockery;
use WPSEO_WooCommerce_Schema;
use Yoast\WP\WooCommerce\Tests\Doubles\Schema_Double;
use Yoast\WP\WooCommerce\Tests\TestCase;

/**
 * Class WooCommerce_Schema_Test.
 */
class Schema_Test extends TestCase {

	/**
	 * Tests that should_output_yoast_schema returns the right value.
	 *
	 * @covers \WPSEO_WooCommerce_Schema::should_output_yoast_schema
	 */
	public function test_should_output_yoast_schema() {
		Monkey\Filters\expectApplied( 'wpseo_json_ld_output' )->once()->andReturn( true );

		$actual = WPSEO_WooCommerce_Schema::should_output_yoast_schema();
		$this->assertEquals( true, $actual );

		Monkey\Filters\expectApplied( 'wpseo_json_ld_output' )->once()->andReturn( false );

		$actual = WPSEO_WooCommerce_Schema::should_output_yoast_schema();
		$this->assertEquals( false, $actual );
	}

	/**
	 * Tests that should_output_yoast_schema returns the right value.
	 *
	 * @covers \WPSEO_WooCommerce_Schema::change_product
	 * @covers \WPSEO_WooCommerce_Schema::get_canonical
	 * @covers \WPSEO_WooCommerce_Schema::add_image
	 * @covers \WPSEO_WooCommerce_Schema::add_brand
	 * @covers \WPSEO_WooCommerce_Schema::add_manufacturer
	 * @covers \WPSEO_WooCommerce_Schema::add_organization_for_attribute
	 */
	public function test_change_product() {
		$product_name = 'TestProduct';
		$base_url     = 'http://local.wordpress.test';
		$canonical    = $base_url . '/product/test/';

		$utils = Mockery::mock( 'alias:WPSEO_Utils' );
		$utils->expects( 'get_home_url' )->once()->with()->andReturn( $canonical );

		$product = Mockery::mock( 'WC_Product' );
		$product->expects( 'get_id' )->twice()->with()->andReturn( 1 );

		Mockery::getConfiguration()->setConstantsMap(
			[
				'WPSEO_Schema_IDs' => [
					'ORGANIZATION_HASH'  => '#organization',
					'WEBPAGE_HASH'       => '#webpage',
					'PRIMARY_IMAGE_HASH' => '#primaryimage',
				],
			]
		);
		Mockery::mock( 'alias:WPSEO_Schema_IDs' );

		Monkey\Functions\stubs(
			[
				'has_post_thumbnail' => true,
			]
		);

		$instance = Mockery::mock( Schema_Double::class )->makePartial();
		$instance->expects( 'get_canonical' )->once()->with()->andReturn( $canonical );
		$instance->expects( 'get_primary_term_or_first_term' )->twice()->with( 'product_cat', 1 )->andReturn( (object) [ 'name' => $product_name ] );
		$instance->options = [
			'dbversion'           => 2,
			'data1_type'          => 'price',
			'data2_type'          => 'stock',
			'schema_brand'        => 'product_cat',
			'schema_manufacturer' => 'product_cat',
			'breadcrumbs'         => false,
			'hide_columns'        => true,
			'metabox_woo_top'     => true,
		];

		$data = [
			'@type'       => 'Product',
			'@id'         => $canonical . '#product',
			'name'        => $product_name,
			'url'         => $canonical,
			'image'       => false,
			'description' => '',
			'sku'         => 1234,
			'offers'      => [
				[
					'@type'  => 'Offer',
					'price'  => '1.00',
					'url'    => $canonical,
					'seller' => [
						'@type' => 'Organization',
						'name'  => 'WP',
						'url'   => $base_url,
					],
				],
			],
		];

		$expected = [
			'@type'            => 'Product',
			'@id'              => $canonical . '#product',
			'name'             => $product_name,
			'url'              => $canonical,
			'image'            => [ '@id' => $canonical . '#primaryimage' ],
			'description'      => '',
			'sku'              => 1234,
			'offers'           => [
				[
					'@type'  => 'Offer',
					'price'  => '1.00',
					'url'    => $canonical,
					'seller' => [
						'@id' => $canonical . '#organization',
					],
				],
			],
			'review'           => [],
			'mainEntityOfPage' => [ '@id' => $canonical . '#webpage' ],
			'brand'            => [
				'@type' => 'Organization',
				'name'  => $product_name,
			],
			'manufacturer'     => [
				'@type' => 'Organization',
				'name'  => $product_name,
			],
		];

		$instance->change_product( $data, $product );
		$this->assertEquals( $expected, $instance->data );
	}
}
