<?php

namespace Yoast\WP\Woocommerce\Tests\Classes;

use Brain\Monkey;
use Brain\Monkey\Functions;
use Mockery;
use WPSEO_WooCommerce_Schema;
use Yoast\WP\Woocommerce\Tests\Doubles\Schema_Double;
use Yoast\WP\Woocommerce\Tests\TestCase;

/**
 * Class WooCommerce_Schema_Test.
 */
class Schema_Test extends TestCase {

	/**
	 * Test setup.
	 */
	public function setUp() {
		parent::setUp();
		if ( ! defined( 'WC_VERSION' ) ) {
			define( 'WC_VERSION', '3.8.1' ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedConstantFound
		}
	}

	/**
	 * Tests that should_output_yoast_schema returns the right value.
	 *
	 * @covers \WPSEO_WooCommerce_Schema::should_output_yoast_schema
	 */
	public function test_should_output_yoast_schema() {
		Monkey\Filters\expectApplied( 'wpseo_json_ld_output' )->once()->andReturn( true );

		$actual = WPSEO_WooCommerce_Schema::should_output_yoast_schema();
		$this->assertTrue( $actual );

		Monkey\Filters\expectApplied( 'wpseo_json_ld_output' )->once()->andReturn( false );

		$actual = WPSEO_WooCommerce_Schema::should_output_yoast_schema();
		$this->assertFalse( $actual );
	}

	/**
	 * Tests that the schema data after change product is as expected.
	 *
	 * @covers \WPSEO_WooCommerce_Schema::change_product
	 * @covers \WPSEO_WooCommerce_Schema::get_canonical
	 * @covers \WPSEO_WooCommerce_Schema::add_image
	 * @covers \WPSEO_WooCommerce_Schema::add_brand
	 * @covers \WPSEO_WooCommerce_Schema::add_manufacturer
	 * @covers \WPSEO_WooCommerce_Schema::add_organization_for_attribute
	 */
	public function test_change_product() {
		$product_id   = 1;
		$product_name = 'TestProduct';
		$base_url     = 'http://local.wordpress.test';
		$canonical    = $base_url . '/product/test/';

		$utils = Mockery::mock( 'alias:WPSEO_Utils' );
		$utils->expects( 'get_home_url' )->once()->with()->andReturn( $canonical );

		$product = Mockery::mock( 'WC_Product' );
		$product->expects( 'get_id' )->times( 3 )->with()->andReturn( $product_id );
		$product->expects( 'get_name' )->once()->with()->andReturn( $product_name );

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

		$mock = Mockery::mock( 'alias:WPSEO_Options' );
		$mock->expects( 'get' )->once()->with( 'woo_schema_brand' )->andReturn( 'product_cat' );
		$mock->expects( 'get' )->once()->with( 'woo_schema_manufacturer' )->andReturn( 'product_cat' );

		Functions\stubs(
			[
				'has_post_thumbnail' => true,
				'get_site_url'       => $base_url,
			]
		);

		$instance = Mockery::mock( Schema_Double::class )->makePartial();
		$instance->expects( 'get_canonical' )->once()->with()->andReturn( $canonical );
		$instance->expects( 'get_primary_term_or_first_term' )->twice()->with( 'product_cat', 1 )->andReturn( (object) [ 'name' => $product_name ] );

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
			'review'      => [
				[
					'@type'         => 'Review',
					'reviewRating'  => [
						'@type'       => 'Rating',
						'ratingValue' => 5,
					],
					'author'        => [
						'@type' => 'Person',
						'name'  => 'Joost de Valk',
					],
					'reviewBody'    => 'Product review',
					'datePublished' => '2020-01-07T13:36:12+00:00',
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
			'review'           => [
				[
					'@type'         => 'Review',
					'reviewRating'  => [
						'@type'       => 'Rating',
						'ratingValue' => 5,
					],
					'author'        => [
						'@type' => 'Person',
						'name'  => 'Joost de Valk',
					],
					'reviewBody'    => 'Product review',
					'datePublished' => '2020-01-07T13:36:12+00:00',
					'@id'           => $base_url . '/#/schema/review/' . $product_id . '-0',
					'name'          => $product_name,
				],
			],
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

	/**
	 * Tests that get_primary_term_or_first_term returns the primary term.
	 *
	 * @covers \WPSEO_WooCommerce_Schema::get_primary_term_or_first_term
	 */
	public function test_get_primary_term_or_first_term_expecting_primary_term() {
		$id            = 1;
		$taxonomy_name = 'product_cat';
		$wp_term       = Mockery::mock( 'WP_Term' );

		$primary_term = Mockery::mock( 'overload:WPSEO_Primary_Term' );
		$primary_term->expects( 'get_primary_term' )->once()->with()->andReturn( $id );

		Functions\expect( 'get_term' )->once()->with( $id )->andReturn( $wp_term );
		Functions\expect( 'get_the_terms' )->never()->withAnyArgs();

		$instance = new Schema_Double();
		$actual   = $instance->get_primary_term_or_first_term( $taxonomy_name, $id );

		$this->assertSame( $wp_term, $actual );
	}

	/**
	 * Tests that get_primary_term_or_first_term returns the first term.
	 *
	 * @covers \WPSEO_WooCommerce_Schema::get_primary_term_or_first_term
	 */
	public function test_get_primary_term_or_first_term_expecting_first_term() {
		$id            = 1;
		$taxonomy_name = 'product_cat';
		$wp_term       = Mockery::mock( 'WP_Term' );

		$primary_term = Mockery::mock( 'overload:WPSEO_Primary_Term' );
		$primary_term->expects( 'get_primary_term' )->once()->with()->andReturn( false );

		Functions\expect( 'get_term' )
			->never()
			->withAnyArgs();

		Functions\expect( 'get_the_terms' )
			->once()
			->with( $id, $taxonomy_name )
			->andReturn(
				[
					$wp_term,
					'other term',
				]
			);

		$instance = new Schema_Double();
		$actual   = $instance->get_primary_term_or_first_term( $taxonomy_name, $id );

		$this->assertSame( $wp_term, $actual );
	}

	/**
	 * Tests that get_primary_term_or_first_term returns the first term.
	 *
	 * @covers \WPSEO_WooCommerce_Schema::get_primary_term_or_first_term
	 */
	public function test_get_primary_term_or_first_term_without_terms() {
		$id            = 1;
		$taxonomy_name = 'product_cat';

		$primary_term = Mockery::mock( 'overload:WPSEO_Primary_Term' );
		$primary_term->expects( 'get_primary_term' )->once()->with()->andReturn( false );

		Functions\expect( 'get_term' )->never()->withAnyArgs();
		Functions\expect( 'get_the_terms' )->once()->with( $id, $taxonomy_name )->andReturn( [] );

		$instance = new Schema_Double();
		$actual   = $instance->get_primary_term_or_first_term( $taxonomy_name, $id );

		$this->assertNull( $actual );
	}
}
