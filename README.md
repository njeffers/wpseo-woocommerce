WooCommerce Yoast SEO
=====================
Requires at least: 4.8
Tested up to: 4.9.1
Stable tag: 5.9
Depends: wordpress-seo

Description
-----------

This extension to WooCommerce and Yoast SEO makes sure there's perfect communication between the two plugins.

Installation
------------

1. Go to Plugins -> Add New.
2. Click "Upload" right underneath "Install Plugins".
3. Upload the zip file that this readme was contained in.
4. Activate the plugin.
5. Go to SEO -> Licenses and enter your WooCommerce SEO license key.
6. Save settings, your license key will be validated. If all is well, you should now see the WooCommerce SEO settings.

Frequently Asked Questions
--------------------------

You can find the FAQ [online here](https://kb.yoast.com/kb/category/woocommerce-seo/).

Changelog
=========

### 5.9: December 5th, 2017
Bugfixes:
* Fixes a bug where product gallery images were being placed above the featured image in the OpenGraph output. This caused an unexpected image to be used when sharing the page.
* Fixes a bug where the Yoast SEO link count columns where not removed from the product page when the setting `Remove Yoast SEO columns` is used.

Other:
* Compatibility with Yoast SEO 5.9

### 5.8: November 15th, 2017
* Compatibility with Yoast SEO 5.8

### 5.7: October 24th, 2017
* Compatibility with Yoast SEO 5.7

### 5.6: October 10th, 2017
Enhancements:
* Changes the capability on which the submenu is registered to `wpseo_manage_options`
* Changes the way the submenu is registered to use the `wpseo_submenu_pages` filter

Bugfixes:
* Fixes a bug where the short product description was cut after 156 characters in the meta description
* Fixes a bug where the license check endpoint was using an incorrect URL

### 5.5: September 26th, 2017
* Updated the internationalization module to version 3.0.

### 5.4: September 6th, 2017
* Compatibility with Yoast SEO 5.4

### 5.3: August 22nd, 2017
* Compatibility with Yoast SEO 5.3

### 5.2: August 8th, 2017
* Compatibility with Yoast SEO 5.2

### 5.1: July 25th, 2017
* Compatibility with Yoast SEO 5.1

### 5.0: July 6th, 2017
* Compatibility with Yoast SEO 5.0

### 4.9: June 7th, 2017
* Adds a filter to set the primary category in the permalink.
* Adds fallbacks for several deprecated warnings.
* Fixes a bug where not all Yoast SEO columns were hidden when the columns output by Yoast were removed.

### 4.8: May 23rd, 2017
* Compatibility with Yoast SEO 4.8

### 4.7: May 2nd, 2017
* Compatibility with Yoast SEO 4.7

### 4.6: April 11th, 2017
* Compatibility with Yoast SEO 4.6

### 4.5: March 21st, 2017
* Compatibility with Yoast SEO 4.5

### 4.4: February 28th, 2017
* Compatibility with Yoast SEO 4.4

### 4.3: February 14th, 2017
* Bugfixes
    * Fixes a bug where duplicate opengraph image tags were added to product categories.

### 4.2.1: February 3rd, 2017

* Bugfixes
	* Fixes "Fatal error: Class 'yoast_i18n' not found". 

### 4.2: January 31st, 2017

* Compatibility with Yoast SEO 4.2

### 4.1: January 17th, 2017

* Compatibility with Yoast SEO 4.1

### 4.0: December 13th, 2016

* Compatibility with Yoast SEO 4.0

### 3.9: November 29th, 2016

* Compatibility with Yoast SEO 3.9

### 3.8: November 8th, 2016

* Compatibility with Yoast SEO 3.8

### 3.7: October 11th, 2016

* Compatibility with Yoast SEO 3.7

### 3.6: September 27th, 2016

* Changes
	* Updated translations.

### 3.5: September 7th, 2016

* Compatibility with YoastSEO 3.5

### 3.4: July 19th, 2016

* Changes
	* Updated translations.

### 3.3: June 14th, 2016

* Enhancements
	* Adds the Yoast i18n module to the Yoast SEO WooCommerce settings page, which informs users the plugin isn't available in their language and what they can do about it.

* Bugfixes
    * Fixes a bug where the support beacon for Yoast SEO WooCommerce was added to all Yoast SEO settings pages.
    * Fixes a bug where updates were not working reliably when multiple paid Yoast plugins were active.

### 3.2.1: April 28th, 2016

* Bug fixes
	* Fixes a bug where the rel=next and rel=prev links were not displayed on shop archive pages 2 and up.

### 3.2: April 20th, 2016

* Bug fixes
	* Fixes a bug where clicking the 'Update now' button on the plugin page didn't update correctly.
	* Fixes a bug where product specific checks that were added to the content analysis would no longer work in combination with Yoast SEO 3.2 and higher.

### 3.1.1: March 2nd, 2016

* Bug fixes
	* Fixes a bug where the Yoast content analysis would break on product edit pages when Yoast WooCommerce SEO and Yoast SEO (Premium) 3.1+ are both active.

### 3.1: March 2nd, 2016

* Bug fixes
	* Fixes a bug where our license manager could sometimes not reach our licensing system due to problems with ssl.

* Enhancements
	* Makes sure users don't have to reactivate their license after updating or disabling/enabling the plugin.
	* Adds a support beacon on the WooCommerce SEO settings page enabling users to ask for support from the WordPress backend.
	* Makes license calls a bit faster.
	* Removed all Twitter card functionality since the Product twitter card no longer exists.

### 3.0: November 18th, 2015

* Synchronized plugin version with all other Yoast SEO plugins for WordPress.

* Bug fixes
	* Fixes deprecation warnings for filters and functions that have been removed in Yoast SEO
	* Fixes a fatal on the frontend when WooCommerce SEO is active but WooCommerce isn't.

* Enhancements
	* Makes sure WooCommerce specific content analysis checks work well with the Real Time content analysis tool in Yoast SEO 3.0.
	* Makes sure the product image galleries are still analyzed as part of the content by the Real Time content analysis tool in Yoast SEO 3.0.
	* Improves the order in which opengraph images are output. First the facebook image, then the facebook image, then the product gallery images.

### 1.1.6: November 11th, 2014
* Bugfixes
	* Fixes a bug where a Fatal error was being raised on the frontend when WooCommerce is not activated.
	* Fixes a bug where Open Graph image tags for featured images and facebook images were not included first when a product image gallery existed.
* Enhancements
	* Defaults to the short description for the meta description when no meta description is set.
	* Added 8 new languages: da_DK, en_GB, es_ES, es_MX, it_IT, nb_NO, nl_NL and tr_TR.

### 1.1.5: September 9th, 2014
* Prevent adding product archive link to XML sitemap

### 1.1.4: July 15th, 2014
* Add `wpseo_woocommerce_og_price` filter. Returning false on it prevents price from being put out in OpenGraph tags.
* Add attribute to breadcrumbs when attribute is selected.
* Removed unused breadcrumb option.
* Only initiate plugin when WP is not installing.

### 1.1.3: June 24th, 2014
* Improved how WooCommerce breadcrumbs are replaced.
* Fixed double class instantiation within same method.
* Add call to `load_plugin_textdomain()`.
* Make sure we recognize WooCommerce product gallery images in page analysis.
* Add images from product gallery to XML sitemap.
* Use product category thumbnail for og:image.
* Make sure short description length test also soft errors when short description is too long.
* Use WooCommerce price formatting functions for price in Twitter card.

### 1.1.2: March 21st, 2014
* Fixed a bug where the breadcrumb caused a fatal error.

### 1.1.1: March 21st, 2014
* Added Yoast license manager to plugin.

### 1.1: March 11th, 2014
* Compatibility update for WP SEO v1.5 including application of a number of best practices.

* Bugfixes
  * Fixed shortcodes should be removed from ogdesc.
  * Fixed duplicate twitter domain meta tag
  * Fixed error loading stylesheet (WPSEO_URL no longer defined).

* Additional enhancements
  * Change the minimum content length requirements to 200, instead of the WP SEO default of 300.
  * Add a length test for the products short description.
  * Make sure the content analysis tests use the product images as well.
  * If a product category has a description, use it for the OpenGraph description.
  * Switch to general WP SEO Licensing class

### 1.0.1: February 17th, 2014
* Add check whether WordPress and WordPress SEO by Yoast are installed and up-to-date

### 1.0: April 8th, 2013
* Initial version.
