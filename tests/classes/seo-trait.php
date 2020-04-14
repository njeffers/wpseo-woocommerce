<?php

namespace Yoast\WP\Woocommerce\Tests\Classes;

use Brain\Monkey\Functions;
use Mockery;
use stdClass;

/**
 * Trait YoastSEO.
 */
trait YoastSEO {

	/**
	 * Holds the classes surface.
	 *
	 * @var \Yoast\WP\SEO\Surfaces\Classes_Surface|Mockery\MockInterface
	 */
	public $classes;

	/**
	 * Holds the meta surface.
	 *
	 * @var \Yoast\WP\SEO\Surfaces\Meta_Surface|Mockery\MockInterface
	 */
	public $meta;

	/**
	 * Holds the helpers surface.
	 *
	 * @var \Yoast\WP\SEO\Surfaces\Helpers_Surface|stdClass
	 */
	public $helpers;

	/**
	 * Builds an instance of YoastSEO Main.
	 */
	public function set_instance() {
		$this->classes = Mockery::mock( 'Yoast\WP\SEO\Surfaces\Classes_Surface' );
		$this->meta    = Mockery::mock( 'Yoast\WP\SEO\Surfaces\Meta_Surface' );
		$this->helpers = new stdClass();

		$this->helpers->open_graph = Mockery::mock( 'Yoast\WP\SEO\Surfaces\Open_Graph_Helpers_Surface' );
		$this->helpers->schema     = new stdClass();
		$this->helpers->twitter    = Mockery::mock( 'Yoast\WP\SEO\Surfaces\Twitter_Helpers_Surface' );

		$this->helpers->schema->image = Mockery::mock();

		Functions\expect( 'YoastSEO' )
			->zeroOrMoreTimes()
			->withNoArgs()
			->andReturn(
				(object) [
					'classes' => $this->classes,
					'meta'    => $this->meta,
					'helpers' => $this->helpers,
				]
			);
	}
}
