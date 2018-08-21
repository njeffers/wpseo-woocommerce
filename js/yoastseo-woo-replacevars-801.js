/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ({

/***/ 2:
/***/ (function(module, exports) {

/* global jQuery, tinyMCE, YoastSEO, wpseoWooReplaceVarsL10n */
var pluginName = "replaceWooVariablePlugin";
var ReplaceVar = window.YoastReplaceVarPlugin && window.YoastReplaceVarPlugin.ReplaceVar;
var placeholders = {};

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
function getPrice() {
	var price = parseFloat( jQuery( "#_regular_price" ).val() );

	return price.toLocaleString(
		wpseoWooReplaceVarsL10n.locale,
		{
			style: "currency",
			currency: wpseoWooReplaceVarsL10n.currency,
		}
	);
}

/**
 * Gets the value of the set short description.
 *
 * @returns {string} The value of the short description.
 */
function getShortDescription() {
	var productDescription = document.getElementById( "excerpt" ).value;
	if ( typeof tinyMCE !== "undefined" && tinyMCE.get( "excerpt" ) !== null ) {
		productDescription = tinyMCE.get( "excerpt" ).getContent();
	}
	return productDescription;
}

/**
 * Gets the taxonomy name from categories.
 * The logic of this function is inspired by: http://viralpatel.net/blogs/jquery-get-text-element-without-child-element/
 *
 * @param {Object} checkbox The checkbox to parse to retrieve the label.
 *
 * @returns {string} The category name.
 */
function extractBrandName( checkbox ) {
	// Take the parent of checkbox with type label and clone it.
	var clonedLabel = checkbox.parent( "label" ).clone();

	// Finds child elements and removes them so we only get the label's text left.
	clonedLabel.children().remove();

	// Returns the trimmed text value.
	return clonedLabel.text().trim();
}

/**
 * Finds the brand element. First it looks to an primary term. If nothing is found it gets the first checked
 * term.
 *
 * @param {jQuery} brandContainer The metabox container to look in.
 *
 * @returns {jQuery|null} The element if found, otherwise null.
 */
function findPrimaryBrand( brandContainer ) {
	var primaryBrand = brandContainer.find( "li.wpseo-primary-term input:checked" );

	if ( primaryBrand.length > 0 ) {
		return primaryBrand.first();
	}

	var checkboxes = brandContainer.find( "li input:checked" );

	if ( checkboxes.length > 0 ) {
		return checkboxes.first();
	}

	return null;
}

/**
 * Returns the name of the first found brand name.
 *
 * @returns {string} The name of the brand.
 */
function getBrand() {
	var brandContainers = [ "#product_brand-all", "#pwb-brand-all" ];
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

	return "";
}

/**
 * Variable replacement plugin for WordPress.
 *
 * @returns {void}
 */
var YoastReplaceVarPlugin = function() {
	this._app = YoastSEO.app;
	this._app.registerPlugin( pluginName, { status: "ready" } );
	this._store = YoastSEO.store;

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
	jQuery( document ).on( "input", "#_regular_price, #_sku", this.declareReloaded.bind( this ) );

	var brandElements = [ "#taxonomy-product_brand", "#pwb-branddiv" ];

	brandElements.forEach( this.registerBrandEvents.bind( this ) );
};

/**
 * Registers the events for the brand containers.
 *
 * @param {string} brandElement The element target name.
 *
 * @returns {void}
 */
YoastReplaceVarPlugin.prototype.registerBrandEvents = function( brandElement ) {
	brandElement = jQuery( brandElement );
	brandElement.on( "wpListAddEnd", ".categorychecklist", this.declareReloaded.bind( this ) );
	brandElement.on( "change", "input[type=checkbox]", this.declareReloaded.bind( this ) );
	brandElement.on( "click active", ".wpseo-make-primary-term", this.declareReloaded.bind( this ) );
};

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
 *
 * @returns {string} The data with all its placeholders replaced by actual values.
 */
YoastReplaceVarPlugin.prototype.replaceVariables = function( data ) {
	if ( typeof data !== "undefined" ) {
		data = data.replace( /%%wc_price%%/g, getPrice() );
		data = data.replace( /%%wc_sku%%/g, jQuery( "#_sku" ).val() );
		data = data.replace( /%%wc_shortdesc%%/g, getShortDescription() );
		data = data.replace( /%%wc_brand%%/g, getBrand() );

		data = this.replacePlaceholders( data );
	}

	return data;
};

/**
 * Adds a replacement object to be used when replacing placeholders.
 *
 * @param {ReplaceVar} replacement The replacement to add to the placeholders.
 *
 * @returns {void}
 */
YoastReplaceVarPlugin.prototype.addReplacement = function( replacement ) {
	placeholders[ replacement.placeholder ] = replacement;
	this._store.dispatch( {
		type: "SNIPPET_EDITOR_UPDATE_REPLACEMENT_VARIABLE",
		name: replacement.placeholder.replace( /^%%|%%$/g, "" ),
		value: replacement.placeholder,
	} );
};

/**
 * Reloads the app to apply possibly made changes in the content.
 *
 * @returns {void}
 */
YoastReplaceVarPlugin.prototype.declareReloaded = function() {
	this._app.pluginReloaded( pluginName );
	this._store.dispatch( { type: "SNIPPET_EDITOR_REFRESH" } );
};

/**
 * Replaces placeholder variables with their replacement value.
 *
 * @param {string} text The text to have its placeholders replaced.
 *
 * @returns {string} The text in which the placeholders have been replaced.
 */
YoastReplaceVarPlugin.prototype.replacePlaceholders = function( text ) {
	for ( var i = 0; i < placeholders.length; i++ ) {
		var replaceVar = placeholders[ i ];

		text = text.replace(
			new RegExp( replaceVar.getPlaceholder( true ), "g" ), replaceVar.replacement
		);
	}
	return text;
};

/**
 * Initializes the Yoast WooCommerce ReplaceVars plugin.
 *
 * @returns {void}
 */
function initializeReplacevarPlugin() {
	// When YoastSEO is available, just instantiate the plugin.
	if ( typeof YoastSEO !== "undefined" && typeof YoastSEO.app !== "undefined" ) {
		new YoastReplaceVarPlugin(); // eslint-disable-line no-new
		return;
	}

	// Otherwise, add an event that will be executed when YoastSEO will be available.
	jQuery( window ).on(
		"YoastSEO:ready",
		function() {
			new YoastReplaceVarPlugin(); // eslint-disable-line no-new
		}
	);
}

initializeReplacevarPlugin();


/***/ })

/******/ });