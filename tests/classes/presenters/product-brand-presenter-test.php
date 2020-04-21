<?php

namespace Yoast\WP\Woocommerce\Tests\Classes\Presenters;

use Brain\Monkey\Functions;
use Mockery;
use WPSEO_WooCommerce_Product_Brand_Presenter;
use Yoast\WP\Woocommerce\Tests\TestCase;

/**
 * Class Product_Brand_Presenter_Test.
 *
 * @coversDefaultClass \WPSEO_WooCommerce_Product_Brand_Presenter
 *
 * @group presenters
 */
class Product_Brand_Presenter_Test extends TestCase {

	/**
	 * Holds the product.
	 *
	 * @var \WC_Product|\Mockery\MockInterface
	 */
	protected $product;

	/**
	 * Holds the product.
	 *
	 * @var \Yoast\WP\SEO\Helpers\Options_Helper|\Mockery\MockInterface
	 */
	protected $options;

	/**
	 * Holds the instance to test.
	 *
	 * @var WPSEO_WooCommerce_Product_Brand_Presenter
	 */
	protected $instance;

	/**
	 * Initializes the test setup.
	 */
	public function setUp() {
		parent::setUp();

		// Needs to exist.
		Mockery::mock( 'overload:Yoast\WP\SEO\Presenters\Abstract_Indexable_Tag_Presenter' );

		$this->product           = Mockery::mock( 'WC_Product' );
		$this->instance          = new WPSEO_WooCommerce_Product_Brand_Presenter( $this->product );
		$this->instance->helpers = (object) [
			'options' => Mockery::mock( 'Yoast\WP\SEO\Helpers\Options_Helper' ),
		];
	}

	/**
	 * Tests that the get function returns the first brand found.
	 *
	 * @covers ::get
	 * @covers ::get_brand_term_name
	 */
	public function test_get() {
		$schema_brand = 'test-brand';

		$this->instance->helpers->options
			->expects( 'get' )
			->once()
			->with( 'woo_schema_brand' )
			->andReturn( $schema_brand );

		// Tests for `get_brand_term_name`.
		Mockery::mock( 'overload:WPSEO_WooCommerce_Utils' )
			->expects( 'search_primary_term' )
			->once()
			->with( [ $schema_brand ], $this->product )
			->andReturn( '' );
		Functions\expect( 'get_the_ID' )
			->once()
			->andReturn( 123 );
		Functions\expect( 'get_the_terms' )
			->once()
			->with( 123, $schema_brand )
			->andReturn(
				[
					(object) [ 'name' => 'first' ],
					(object) [ 'name' => 'second' ],
					(object) [ 'name' => 'third' ],
				]
			);

		$this->assertEquals( 'first', $this->instance->get() );
	}

	/**
	 * Tests that the get function returns an empty string when no brands are found.
	 *
	 * @covers ::get
	 * @covers ::get_brand_term_name
	 */
	public function test_get_without_brands() {
		$schema_brand = 'test-brand';

		$this->instance->helpers->options
			->expects( 'get' )
			->once()
			->with( 'woo_schema_brand' )
			->andReturn( $schema_brand );

		// Tests for `get_brand_term_name`.
		Mockery::mock( 'overload:WPSEO_WooCommerce_Utils' )
			->expects( 'search_primary_term' )
			->once()
			->with( [ $schema_brand ], $this->product )
			->andReturn( '' );
		Functions\expect( 'get_the_ID' )
			->once()
			->andReturn( 123 );
		Functions\expect( 'get_the_terms' )
			->once()
			->with( 123, $schema_brand )
			->andReturn( [] );

		$this->assertEquals( '', $this->instance->get() );
	}

	/**
	 * Tests that the get function returns the primary brand.
	 *
	 * @covers ::get
	 * @covers ::get_brand_term_name
	 */
	public function test_get_primary_brand() {
		$schema_brand = 'test-brand';

		$this->instance->helpers->options
			->expects( 'get' )
			->once()
			->with( 'woo_schema_brand' )
			->andReturn( $schema_brand );

		// Tests for `get_brand_term_name`.
		Mockery::mock( 'overload:WPSEO_WooCommerce_Utils' )
			->expects( 'search_primary_term' )
			->once()
			->with( [ $schema_brand ], $this->product )
			->andReturn( 'primary' );

		$this->assertEquals( 'primary', $this->instance->get() );
	}
}
