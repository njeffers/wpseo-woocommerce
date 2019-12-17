<?php
/**
 * WooCommerce Yoast SEO plugin test file.
 *
 * @package WPSEO/WooCommerce/Tests
 */

/**
 * Unit tests.
 */
class WPSEO_Option_Woo_Test extends WPSEO_WooCommerce_UnitTestCase {

	/**
	 * Instance of the class being tested.
	 *
	 * @var WPSEO_Option_Woo_Double
	 */
	protected $option;

	/**
	 * Requires the test double.
	 */
	public static function setUpBeforeClass() {
		parent::setUpBeforeClass();

		require_once './integration-tests/doubles/option-woo-double.php';
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers WPSEO_Option_Woo::__construct
	 */
	public function test_constructor() {
		$option = new WPSEO_Option_Woo_Double();
		$this->assertSame(
			[
				'price' => 'Price',
				'stock' => 'Stock',
			],
			$option->valid_data_types
		);
	}

	/**
	 * Gets the data from the data provider.
	 *
	 * @dataProvider validate_option_values
	 *
	 * @param string           $field_name The field name to validate.
	 * @param string|bool      $expected   The expected value.
	 * @param string|bool|null $dirty      The value for the dirty argument.
	 * @param string|bool      $clean      The value for the clean argument.
	 * @param string|bool|null $old        The value for the old argument.
	 * @param string           $short      Determines whether the short form should set or not.
	 *
	 * @covers WPSEO_Option_Woo::validate_option
	 */
	public function test_validate_option( $field_name, $expected, $dirty, $clean, $old, $short = 'off' ) {
		$option = $this
			->getMockBuilder( 'WPSEO_Option_Woo_Double' )
			->setMethods( [ 'get_taxonomies' ] )
			->getMock();

		$option
			->expects( $this->once() )
			->method( 'get_taxonomies' )
			->will( $this->returnValue( [ 'yoast' ] ) );

		$dirty = ( $dirty !== null ) ? [ $field_name => $dirty ] : [];
		$old   = ( $old !== null ) ? [ $field_name => $old ] : [];

		$result = $option->validate_option(
			array_merge( [ 'short_form' => $short ], $dirty ),
			[ $field_name => $clean ],
			$old
		);

		$this->assertSame( [ $field_name => $expected ], $result );
	}

	/**
	 * Provider for the test_validate_option.
	 *
	 * Formatting of each record that is provided:
	 * field, expected, dirty, clean, old and short-form.
	 *
	 * @return array
	 */
	public function validate_option_values() {
		return [
			// Tests a non defined value.
			[ 'test', null, 123, null, null ],

			// Tests the validation of the dbversion option.
			[ 'dbversion', 2, 1, 3, '' ],

			// Tests the validation of the fields where the dirty value exists in the validate data types.
			[ 'data1_type', 'price', 'price', 'price', null ],
			[ 'data2_type', 'price', 'price', 'price', null ],
			[ 'schema_brand', 'yoast', 'yoast', 'yoast', null ],
			[ 'schema_manufacturer', 'yoast', 'yoast', 'yoast', null ],
			[ 'breadcrumbs', true, true, true, '' ],
			[ 'hide_columns', true, true, true, '' ],
			[ 'metabox_woo_top', true, true, true, '' ],

			// Validation where the dirty value is not in the validate data types.
			[ 'data1_type', 'foo', 'foo', 'price', null ],
			[ 'data2_type', 'foo', 'foo', 'price', null ],
			[ 'schema_brand', 'bar', 'bar', 'yoast', null ],
			[ 'schema_manufacturer', 'bar', 'bar', 'yoast', null ],
			[ 'breadcrumbs', false, null, true, '' ],
			[ 'hide_columns', false, null, true, '' ],
			[ 'metabox_woo_top', false, null, true, '' ],

			// Validation where the old value is in the validate data types with short form enabled.
			[ 'data1_type', 'price', null, 'price', 'price', 'on' ],
			[ 'data2_type', 'price', null, 'price', 'price', 'on' ],
			[ 'schema_brand', 'yoast', null, 'yoast', 'yoast,', 'on' ],
			[ 'schema_manufacturer', 'yoast', null, 'yoast', 'yoast', 'on' ],

			// Validation where the old value isn't in the validate data types with short form enabled.
			[ 'data1_type', 'foo', null, 'price', 'foo', 'on' ],
			[ 'data2_type', 'foo', null, 'price', 'foo', 'on' ],
			[ 'schema_brand', 'bar', null, 'yoast', 'bar', 'on' ],
			[ 'schema_manufacturer', 'bar', null, 'yoast', 'bar', 'on' ],

			// Validation where the old value isn't in the validate data types with short form not enabled.
			[ 'data1_type', 'price', null, 'price', 'foo', 'off' ],
			[ 'data2_type', 'price', null, 'price', 'foo', 'off' ],
			[ 'schema_brand', 'yoast', null, 'yoast', 'bar', 'off' ],
			[ 'schema_manufacturer', 'yoast', null, 'yoast', 'bar', 'off' ],

			// Validation where the boolean old value is set with short form enabled.
			[ 'breadcrumbs', true, null, true, true, 'on' ],
			[ 'hide_columns', true, null, true, true, 'on' ],
			[ 'metabox_woo_top', true, null, true, true, 'on' ],

			// Validation where the boolean old value is not set with short form enabled.
			[ 'breadcrumbs', false, null, true, null, 'on' ],
			[ 'hide_columns', false, null, true, null, 'on' ],
			[ 'metabox_woo_top', false, null, true, null, 'on' ],

			// Validation where the boolean old value is not set with short form not enabled.
			[ 'breadcrumbs', false, null, true, true, 'off' ],
			[ 'hide_columns', false, null, true, true, 'off' ],
			[ 'metabox_woo_top', false, null, true, true, 'off' ],
		];
	}
}
