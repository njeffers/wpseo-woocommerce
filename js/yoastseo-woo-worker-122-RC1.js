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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = yoast.analysis;

/***/ }),
/* 1 */,
/* 2 */,
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: external "yoast.analysis"
var external_yoast_analysis_ = __webpack_require__(0);

// CONCATENATED MODULE: ./js/src/assessments/ProductDescriptionAssessment.js


const { stripHTMLTags } = external_yoast_analysis_["string"];

/**
 * Represents the assessment for the product description.
 */
class ProductDescriptionAssessment_ProductDescriptionAssessment extends external_yoast_analysis_["Assessment"] {
	/**
	 * Constructs a product description assessment.
	 *
	 * @param {string} productDescription The product description as it is when initializing
	 * @param {Object} l10n The translations for this assessment.
	 *
	 * @returns {void}
	 */
	constructor( productDescription, l10n ) {
		super();

		this._l10n = l10n;
		this.updateProductDescription( productDescription );
	}

	/**
	 * Updates the product description to the given one.
	 *
	 * @param {string} productDescription The current product description.
	 *
	 * @returns {void}
	 */
	updateProductDescription( productDescription ) {
		this._productDescription = productDescription;
	}

	/**
	 * Tests the length of the product description.
	 *
	 * @returns {object} an assessment result with the score and formatted text.
	 */
	getResult() {
		const productDescription = this._productDescription;

		const strippedProductDescription = stripHTMLTags( productDescription );
		const productDescriptionLength = strippedProductDescription.split( " " ).length;

		const result = this.scoreProductDescription( productDescriptionLength );

		const assessmentResult = new external_yoast_analysis_["AssessmentResult"]();
		assessmentResult.setScore( result.score );
		assessmentResult.setText( result.text );

		return assessmentResult;
	}

	/**
	 * Returns the score based on the length of the product description.
	 *
	 * @param {number} length The length of the product description.
	 * @returns {{score: number, text: *}} The result object with score and text.
	 */
	scoreProductDescription( length ) {
		if ( length === 0 ) {
			return {
				score: 1,
				text: this._l10n.woo_desc_none,
			};
		}

		if ( length > 0 && length < 20 ) {
			return {
				score: 5,
				text: this._l10n.woo_desc_short,
			};
		}

		if ( length >= 20 && length <= 50 ) {
			return {
				score: 9,
				text: this._l10n.woo_desc_good,
			};
		}
		if ( length > 50 ) {
			return {
				score: 5,
				text: this._l10n.woo_desc_long,
			};
		}
	}
}

// CONCATENATED MODULE: ./js/src/yoastseo-woo-worker.js
/* global analysisWorker */



const PLUGIN_NAME = "YoastWooCommerce";
const ASSESSMENT_NAME = "productTitle";

/**
 * Represents the WooCommerce worker.
 */
class yoastseo_woo_worker_WooCommerceWorker {
	/**
	 * Constructs a worker to be run inside the analysis web worker.
	 */
	constructor() {
		this._worker = analysisWorker;
	}

	/**
	 * Registers our custom messages.
	 *
	 * @returns {void}
	 */
	register() {
		this._worker.registerMessageHandler( "initialize", this.initialize.bind( this ), PLUGIN_NAME );
		this._worker.registerMessageHandler( "updateProductDescription", this.updateProductDescription.bind( this ), PLUGIN_NAME );
	}

	/**
	 * Initializes our custom assessment.
	 *
	 * @param {string} productDescription The current product description.
	 * @param {Object} l10n Translation object with our translations.
	 *
	 * @returns {void}
	 */
	initialize( { productDescription, l10n } ) {
		this._productDescriptionAssessment = new ProductDescriptionAssessment_ProductDescriptionAssessment( productDescription, l10n );

		this._worker.registerAssessment( ASSESSMENT_NAME, this._productDescriptionAssessment, PLUGIN_NAME );
		this._worker.refreshAssessment( ASSESSMENT_NAME, PLUGIN_NAME );
	}

	/**
	 * Updates the product description in the assessment and marks it as refreshed.
	 *
	 * @param {string} productDescription The new product description.
	 *
	 * @returns {void}
	 */
	updateProductDescription( productDescription ) {
		this._productDescriptionAssessment.updateProductDescription( productDescription );

		this._worker.refreshAssessment( ASSESSMENT_NAME, PLUGIN_NAME );
	}
}

const wooCommerceWorker = new yoastseo_woo_worker_WooCommerceWorker();

wooCommerceWorker.register();


/***/ })
/******/ ]);