<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Mocks
 */

namespace Yoast\WP\SEO\Tests\Mocks;

use Brain\Monkey\Functions;
use Mockery;
use stdClass;

/**
 * Trait YoastSEO.
 */
trait YoastSEO {

	/**
	 * @var \Yoast\WP\SEO\Surfaces\Classes_Surface|Mockery\MockInterface
	 */
	public $classes;

	/**
	 * @var \Yoast\WP\SEO\Surfaces\Meta_Surface|Mockery\MockInterface
	 */
	public $meta;

	/**
	 * @var \Yoast\WP\SEO\Surfaces\Helpers_Surface|stdClass
	 */
	public $helpers;

	/**
	 * Builds an instance of YoastSEO Main.
	 */
	public function set_instance() {
		$this->classes             = Mockery::mock( 'Yoast\WP\SEO\Surfaces\Classes_Surface' );
		$this->meta                = Mockery::mock( 'Yoast\WP\SEO\Surfaces\Meta_Surface' );
		$this->helpers             = new stdClass();

		$this->helpers->open_graph = Mockery::mock( 'Yoast\WP\SEO\Surfaces\Open_Graph_Helpers_Surface' );
		$this->helpers->schema     = new stdClass();
		$this->helpers->twitter    = Mockery::mock( 'Yoast\WP\SEO\Surfaces\Twitter_Helpers_Surface' );

		$this->helpers->schema->image = Mockery::mock();

		Functions\expect( 'YoastSEO' )
			->zeroOrMoreTimes()
			->withNoArgs()
			->andReturn( (object) [
				'classes' => $this->classes,
				'meta'    => $this->meta,
				'helpers' => $this->helpers,
			] );
	}
}
