(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* global jQuery, tinyMCE, YoastSEO, window.YoastReplaceVarPlugin.ReplaceVar, wpseoWooReplaceVarsL10n */
( function() {
	'use strict';

	var pluginName = 'replaceWooVariablePlugin';
	var ReplaceVar = window.YoastReplaceVarPlugin.ReplaceVar;
	var placeholders = {};

	var brandElements = [ '#taxonomy-product_brand', '#pwb-branddiv' ];

	var modifiableFields = [
		"content",
		"title",
		"snippet_title",
		"snippet_meta",
		"primary_category",
		"data_page_title",
		"data_meta_desc",
	];

	/**
	 * Calculates the price based on the set price and sale price.
	 *
	 * @returns {string} The calculated price.
	 */
	function GetPrice() {
		var regularPrice = parseFloat( jQuery( "#_regular_price" ).val() );
		var salePrice = parseFloat( jQuery( "#_sale_price" ).val() );
		var price = regularPrice;

		if ( salePrice > 0 && salePrice < price ) {
			price = regularPrice - salePrice;
		}

		// Formats the price.
		price = Math.round( price );
		price = price.toFixed( parseInt( wpseoWooReplaceVarsL10n.decimals, 10 ) );
		price = price.toLocaleString( wpseoWooReplaceVarsL10n.locale, { currency: wpseoWooReplaceVarsL10n.currency } );
		return wpseoWooReplaceVarsL10n.currencySymbol + " " +  price;
	}

	/**
	 * Gets the value of the set short description.
	 *
	 * @returns {string} The value of the short description.
	 */
	function GetShortDescription() {
		var productDescription = document.getElementById( 'excerpt' ).value;
		if (typeof tinyMCE !== 'undefined' && tinyMCE.get( 'excerpt') !== null) {
			productDescription = tinyMCE.get( 'excerpt').getContent();
		}

		return productDescription;
	}

	/**
	 * Gets the taxonomy name from categories.
	 * The logic of this function is inspired by: http://viralpatel.net/blogs/jquery-get-text-element-without-child-element/
	 *
	 * @param {Object} checkbox The checkbox to parse to retrieve the label.
	 * @returns {string} The category name.
	 */
	function extractBrandName( checkbox ) {
		// Take the parent of checkbox with type label and clone it.
		var clonedLabel = checkbox.parent( "label" ).clone();

		// Finds child elements and removes them so we only get the label's text left.
		clonedLabel.children().remove();

		// Returns the trimmed text value,
		return clonedLabel.text().trim();
	}

	function findPrimaryBrand( brandContainer ) {
		var primaryBrand = brandContainer.find( 'li.wpseo-primary-term input:checked' );
		if ( primaryBrand.length > 0 ) {
			return primaryBrand.first();
		}

		var checkboxes = brandContainer.find( 'li input:checked' );
		if( checkboxes.length > 0 ) {
			return checkboxes.first();
		}

		return null;
	}

	function getBrand() {
		var brandContainers = [ '#product_brand-all', '#pwb-brand-all' ];
		var totalBrandContainers = brandContainers.length;
		for( var i = 0; i < totalBrandContainers; i++ ) {
			var brandContainer = jQuery( brandContainers[ i ] );
			if ( brandContainer.length === 0 ) {
				continue;
			}

			var primaryProductBrand = findPrimaryBrand( brandContainer );
			if ( primaryProductBrand !== null && primaryProductBrand.length > 0 ) {
				return extractBrandName( jQuery( primaryProductBrand ) );
			}
		}

		return '';
	}

	/**
	 * Variable replacement plugin for WordPress.
	 *
	 * @returns {void}
	 */
	var YoastReplaceVarPlugin = function() {
		this._app = YoastSEO.app;
		this._app.registerPlugin( pluginName, { status: "ready" } );

		this.registerReplacements();
		this.registerModifications( this._app );
		this.registerEvents();
	};

	/**
	 * Register the events that might have influence for the replace vars.
	 *
	 * @returns {void}
	 */
	YoastReplaceVarPlugin.prototype.registerEvents = function() {
		brandElements.forEach( this.registerBrandEvents.bind( this ) );
	};

	YoastReplaceVarPlugin.prototype.registerBrandEvents = function( brandElement ) {
		brandElement = jQuery( brandElement );
		brandElement.on( "wpListAddEnd", ".categorychecklist", this.declareReloaded.bind( this ) );
		brandElement.on( "change", "input[type=checkbox]", this.declareReloaded.bind( this ) );
		brandElement.on( "click active", ".wpseo-make-primary-term", this.declareReloaded.bind( this ) );
	}


	/**
	 * Registers all the placeholders and their replacements.
	 *
	 * @returns {void}
	 */
	YoastReplaceVarPlugin.prototype.registerReplacements = function() {
		this.addReplacement( new ReplaceVar( "%%wc_price%%",     "wc_price" ) );
		this.addReplacement( new ReplaceVar( "%%wc_sku%%",       "wc_sku" ) );
		this.addReplacement( new ReplaceVar( "%%wc_shortdesc%%", "wc_shortdesc" ) );
		this.addReplacement( new ReplaceVar( "%%wc_brand%%",     "wc_brand" ) );
	};

	/**
	 * Registers the modifications for the plugin on initial load.
	 *
	 * @param {app} app The app object.
	 *
	 * @returns {void}
	 */
	YoastReplaceVarPlugin.prototype.registerModifications = function( app ) {
		var callback = this.replaceVariables.bind( this );

		for ( var i = 0; i < modifiableFields.length; i++ ) {
			app.registerModification( modifiableFields[ i ], callback, pluginName, 10 );
		}
	};

	/**
	 * Runs the different replacements on the data-string.
	 *
	 * @param {string} data The data that needs its placeholders replaced.
	 * @returns {string} The data with all its placeholders replaced by actual values.
	 */
	YoastReplaceVarPlugin.prototype.replaceVariables = function( data ) {
		if ( typeof data !== "undefined" ) {
			data = data.replace( /%%wc_price%%/g, GetPrice() );
			data = data.replace( /%%wc_sku%%/g, jQuery( '#_sku' ).val() );
			data = data.replace( /%%wc_shortdesc%%/g, GetShortDescription() );
			data = data.replace( /%%wc_brand%%/g, getBrand() );

			data = this.replacePlaceholders( data );
		}

		return data;
	};

	/**
	 * Add a replacement object to be used when replacing placeholders.
	 *
	 * @param {ReplaceVar} replacement The replacement to add to the placeholders.
	 *
	 * @returns {void}
	 */
	YoastReplaceVarPlugin.prototype.addReplacement = function( replacement ) {
		placeholders[ replacement.placeholder ] = replacement;
	};

	/**
	 * Declares reloaded with YoastSEO.
	 *
	 * @returns {void}
	 */
	YoastReplaceVarPlugin.prototype.declareReloaded = function() {
		this._app.pluginReloaded( pluginName );
	};

	/**
	 * Replaces placeholder variables with their replacement value.
	 *
	 * @param {string} text The text to have its placeholders replaced.
	 * @returns {string} The text in which the placeholders have been replaced.
	 */
	YoastReplaceVarPlugin.prototype.replacePlaceholders = function( text ) {
		for ( var placeholder in placeholders ) {
			var replaceVar = placeholders[ placeholder ];
			text = text.replace(
				new RegExp( replaceVar.getPlaceholder( true ), "g" ), replaceVar.replacement
			);
		}

		return text;
	};

	/**
	 * Adds event listener to load the Yoast WooCommerce replacevars plugin
	 */
	if ( typeof YoastSEO !== 'undefined' && typeof YoastSEO.app !== 'undefined' ) {
		new YoastReplaceVarPlugin();
	}
	else {
		jQuery( window ).on(
			'YoastSEO:ready',
			function() {
				new YoastReplaceVarPlugin();
			}
		);
	}
}() );
},{}]},{},[1]);
