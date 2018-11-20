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
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./js/src/yoastseo-woo-handle-excerpt-editors.js
/* global YoastSEO tinyMCE jQuery */

/*
 * This module handles getting the excerpt/short product description
 * from the excerpt editor and sending the updated
 * excerpt to the analysis web worker when it changes.
 *
 * Handles the Visual- as well as the Text editor.
 */

const EXCERPT_EDITOR_ID = "excerpt";

/**
 * Returns whether or not the TinyMCE script is available on the page.
 *
 * @returns {boolean} True when TinyMCE is loaded.
 */
function isTinyMCELoaded() {
	return (
		typeof tinyMCE !== "undefined" &&
		typeof tinyMCE.editors !== "undefined" &&
		tinyMCE.editors.length >= 0
	);
}

/**
 * Gets content from the Text editor field by element id.
 *
 * @param {string} elementID The (HTML) id attribute of the Text editor to get the contents from.
 *
 * @returns {string} The editor's content.
 */
function getTextEditorContent( elementID ) {
	return document.getElementById( elementID ) && document.getElementById( elementID ).value || "";
}

/**
 * Returns whether or not a TinyMCE editor with the given ID is available.
 *
 * @param {string} editorID The ID of the TinyMCE editor.
 *
 * @returns {boolean} Whether TinyMCE is available.
 */
function isTinyMCEAvailable( editorID ) {
	if ( ! isTinyMCELoaded() ) {
		return false;
	}
	const editor = tinyMCE.get( editorID );
	return editor !== null && ! editor.isHidden();
}

/**
 * Returns the excerpt/short product description.
 *
 * @returns {string} The excerpt.
 */
function getExcerpt() {
	if ( isTinyMCEAvailable( EXCERPT_EDITOR_ID ) ) {
		// User has Visual editor activated.
		const excerptElement = tinyMCE.get( EXCERPT_EDITOR_ID );
		return excerptElement.getContent();
	}
	// User has Text editor activated.
	return getTextEditorContent( EXCERPT_EDITOR_ID );
}

/**
 * Sends a new short product description to the worker.
 *
 * @param {AnalysisWebWorker} worker The worker to send the the message to.
 *
 * @returns {void}
 */
function handleExcerptChange( worker ) {
	const excerpt = getExcerpt();

	worker.sendMessage( "updateProductDescription", excerpt, "YoastWooCommerce" );

	YoastSEO.app.refresh();
}

/**
 * Adds event handlers for when the text in the excerpt Visual editor changes.
 * A new excerpt/short product description gets sent to the web worker when it does.
 *
 * @param {AnalysisWebWorker} worker The web worker to which to send the excerpts.
 * @returns {void}
 */
function addVisualEditorEventHandlers( worker ) {
	const excerptElement = tinyMCE.get( EXCERPT_EDITOR_ID );
	excerptElement.on( "change", () => handleExcerptChange( worker ) );
	excerptElement.on( "input", () => handleExcerptChange( worker ) );
}

/**
 * Adds event handlers for when the text in the excerpt raw Text editor changes.
 * A new excerpt/short product description gets sent to the web worker when it does.
 *
 * @param {AnalysisWebWorker} worker The web worker to which to send the excerpts.
 * @returns {void}
 */
function addTextEditorEventHandlers( worker ) {
	const excerptElement = jQuery( "#excerpt" );
	excerptElement.on( "change", () => handleExcerptChange( worker ) );
	excerptElement.on( "input", () => handleExcerptChange( worker ) );
}

/**
 * Adds event handlers for when the excerpt/short product description changes
 * in either the Text- or the Visual editor.
 *
 * A new excerpt/short product description gets sent to the web worker when the
 * text changes.
 *
 * @param {AnalysisWebWorker} worker The analysis web worker to send messages to.
 * @returns {void}
 */
function addExcerptEventHandlers( worker ) {
	/*
	  Text editor is always available, but hidden.
	  So we can add event handlers on startup.
	 */
	addTextEditorEventHandlers( worker );

	/*
	  Visual editor is added / removed on switch,
	  so check if we are in Visual mode on startup.
	 */
	if ( isTinyMCEAvailable( EXCERPT_EDITOR_ID ) ) {
		addVisualEditorEventHandlers( worker );
	}

	if ( isTinyMCELoaded() ) {
		tinyMCE.on( "AddEditor", () => {
			// Switched to Visual editor.
			addVisualEditorEventHandlers( worker );
		} );
	}
}

// CONCATENATED MODULE: ./js/src/yoastseo-woo-plugin.js
/* global YoastSEO, wpseoWooL10n */



const PLUGIN_NAME = "YoastWooCommerce";

/**
 * Counters for the setTimeouts, used to make sure we don't end up in an infinite loop.
 *
 * @type {number}
 */
var buttonEventCounter = 0;
var deleteEventCounter = 0;

class yoastseo_woo_plugin_YoastWooCommercePlugin {
	/**
	 * Registers Plugin and Test for Yoast WooCommerce.
	 *
	 * @returns {void}
	 */
	constructor() {
		this.loadWorkerScript();

		YoastSEO.app.registerPlugin( "YoastWooCommercePlugin", { status: "ready" } );

		this.registerModifications();

		this.bindEvents();
	}

	/**
	 * Loads our worker script into the analysis worker.
	 *
	 * @returns {void}
	 */
	loadWorkerScript() {
		if ( typeof YoastSEO === "undefined" || typeof YoastSEO.analysis === "undefined" || typeof YoastSEO.analysis.worker === "undefined" ) {
			return;
		}

		const worker = YoastSEO.analysis.worker;
		const productDescription = getExcerpt();

		worker.loadScript( wpseoWooL10n.script_url )
			.then( () => worker.sendMessage( "initialize", { l10n: wpseoWooL10n, productDescription }, PLUGIN_NAME ) )
			.then( YoastSEO.app.refresh );

		addExcerptEventHandlers( worker );
	}

	/**
	 * Binds events to the add_product_images anchor.
	 *
	 * @returns {void}
	 */
	bindEvents() {
		jQuery( ".add_product_images" ).find( "a" ).on( "click", this.bindLinkEvent.bind( this ) );
	}

	/**
	 * After the modal dialog is opened, check for the button that adds images to the gallery to trigger
	 * the modification.
	 *
	 * @returns {void}
	 */
	bindLinkEvent() {
		if ( jQuery( ".media-modal-content" ).find( ".media-button" ).length === 0 ) {
			buttonEventCounter++;
			if ( buttonEventCounter < 10 ) {
				setTimeout( this.bindLinkEvent.bind( this ) );
			}
		} else {
			buttonEventCounter = 0;
			jQuery( ".media-modal-content" ).find( ".media-button" ).on( "click", this.buttonCallback.bind( this )  );
		}
	}

	/**
	 * After the gallery is added, call the analyzeTimer of the app, to add the modifications.
	 * Also call the bindDeleteEvent, to bind the analyzerTimer when an image is deleted.
	 *
	 * @returns {void}
	 */
	buttonCallback() {
		YoastSEO.app.analyzeTimer();
		this.bindDeleteEvent();
	}

	/**
	 * Checks if the delete buttons of the added images are available. When they are, bind the analyzeTimer function
	 * so when a image is removed, the modification is run.
	 *
	 * @returns {void}
	 */
	bindDeleteEvent() {
		if ( jQuery( "#product_images_container" ).find( ".delete" ).length === 0 ) {
			deleteEventCounter++;
			if ( deleteEventCounter < 10 ) {
				setTimeout( this.bindDeleteEvent.bind( this ) );
			}
		} else {
			deleteEventCounter = 0;
			jQuery( "#product_images_container" ).find( ".delete" ).on( "click", YoastSEO.app.analyzeTimer.bind( YoastSEO.app ) );
		}
	}

	/**
	 * Registers the addImageToContent modification.
	 *
	 * @returns {void}
	 */
	registerModifications() {
		var callback = this.addImageToContent.bind( this );

		YoastSEO.app.registerModification( "content", callback, "YoastWooCommercePlugin", 10 );
	}

	/**
	 * Adds the images from the page gallery to the content to be analyzed by the analyzer.
	 *
	 * @param {string} data The data string that does not have the images outer html.
	 *
	 * @returns {string} The data string parameter with the images outer html.
	 */
	addImageToContent( data ) {
		var images = jQuery( "#product_images_container" ).find( "img" );

		for( var i = 0; i < images.length; i++ ) {
			data += images[ i ].outerHTML;
		}
		return data;
	}
}

/**
 * Adds eventlistener to load the Yoast WooCommerce plugin.
 */
if( typeof YoastSEO !== "undefined" && typeof YoastSEO.app !== "undefined" ) {
	new yoastseo_woo_plugin_YoastWooCommercePlugin(); // eslint-disable-line no-new
} else {
	jQuery( window ).on(
		"YoastSEO:ready",
		function() {
			new yoastseo_woo_plugin_YoastWooCommercePlugin(); // eslint-disable-line no-new
		}
	);
}


/***/ })

/******/ });