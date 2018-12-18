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

eval("module.exports = yoast.analysis;\n\n//# sourceURL=webpack:///external_%22yoast.analysis%22?");

/***/ }),
/* 1 */,
/* 2 */,
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n\n// EXTERNAL MODULE: external \"yoast.analysis\"\nvar external_yoast_analysis_ = __webpack_require__(0);\n\n// CONCATENATED MODULE: ./js/src/assessments/ProductDescriptionAssessment.js\n\n\nconst { stripHTMLTags } = external_yoast_analysis_[\"string\"];\n\nclass ProductDescriptionAssessment_ProductDescriptionAssessment extends external_yoast_analysis_[\"Assessment\"] {\n\t/**\n\t * Constructs a product description assessment.\n\t *\n\t * @param {string} productDescription The product description as it is when initializing\n\t * @param {Object} l10n The translations for this assessment.\n\t *\n\t * @returns {void}\n\t */\n\tconstructor( productDescription, l10n ) {\n\t\tsuper();\n\n\t\tthis._l10n = l10n;\n\t\tthis.updateProductDescription( productDescription );\n\t}\n\n\t/**\n\t * Updates the product description to the given one.\n\t *\n\t * @param {string} productDescription The current product description.\n\t *\n\t * @returns {void}\n\t */\n\tupdateProductDescription( productDescription ) {\n\t\tthis._productDescription = productDescription;\n\t}\n\n\t/**\n\t * Tests the length of the product description.\n\t *\n\t * @returns {object} an assessment result with the score and formatted text.\n\t */\n\tgetResult() {\n\t\tconst productDescription = this._productDescription;\n\n\t\tconst strippedProductDescription = stripHTMLTags( productDescription );\n\t\tconst productDescriptionLength = strippedProductDescription.split( \" \" ).length;\n\n\t\tconst result = this.scoreProductDescription( productDescriptionLength );\n\n\t\tconst assessmentResult = new external_yoast_analysis_[\"AssessmentResult\"]();\n\t\tassessmentResult.setScore( result.score );\n\t\tassessmentResult.setText( result.text );\n\n\t\treturn assessmentResult;\n\t}\n\n\t/**\n\t * Returns the score based on the length of the product description.\n\t *\n\t * @param {number} length The length of the product description.\n\t * @returns {{score: number, text: *}} The result object with score and text.\n\t */\n\tscoreProductDescription( length ) {\n\t\tif ( length === 0 ) {\n\t\t\treturn {\n\t\t\t\tscore: 1,\n\t\t\t\ttext: this._l10n.woo_desc_none,\n\t\t\t};\n\t\t}\n\n\t\tif ( length > 0 && length < 20 ) {\n\t\t\treturn {\n\t\t\t\tscore: 5,\n\t\t\t\ttext: this._l10n.woo_desc_short,\n\t\t\t};\n\t\t}\n\n\t\tif ( length >= 20 && length <= 50 ) {\n\t\t\treturn {\n\t\t\t\tscore: 9,\n\t\t\t\ttext: this._l10n.woo_desc_good,\n\t\t\t};\n\t\t}\n\t\tif ( length > 50 ) {\n\t\t\treturn {\n\t\t\t\tscore: 5,\n\t\t\t\ttext: this._l10n.woo_desc_long,\n\t\t\t};\n\t\t}\n\t}\n}\n\n// CONCATENATED MODULE: ./js/src/yoastseo-woo-worker.js\n/* global analysisWorker */\n\n\n\nconst PLUGIN_NAME = \"YoastWooCommerce\";\nconst ASSESSMENT_NAME = \"productTitle\";\n\nclass yoastseo_woo_worker_WooCommerceWorker {\n\t/**\n\t * Constructs a worker to be run inside the analysis web worker.\n\t */\n\tconstructor() {\n\t\tthis._worker = analysisWorker;\n\t}\n\n\t/**\n\t * Registers our custom messages.\n\t *\n\t * @returns {void}\n\t */\n\tregister() {\n\t\tthis._worker.registerMessageHandler( \"initialize\", this.initialize.bind( this ), PLUGIN_NAME );\n\t\tthis._worker.registerMessageHandler( \"updateProductDescription\", this.updateProductDescription.bind( this ), PLUGIN_NAME );\n\t}\n\n\t/**\n\t * Initializes our custom assessment.\n\t *\n\t * @param {string} productDescription The current product description.\n\t * @param {Object} l10n Translation object with our translations.\n\t *\n\t * @returns {void}\n\t */\n\tinitialize( { productDescription, l10n } ) {\n\t\tthis._productDescriptionAssessment = new ProductDescriptionAssessment_ProductDescriptionAssessment( productDescription, l10n );\n\n\t\tthis._worker.registerAssessment( ASSESSMENT_NAME, this._productDescriptionAssessment, PLUGIN_NAME );\n\t\tthis._worker.refreshAssessment( ASSESSMENT_NAME, PLUGIN_NAME );\n\t}\n\n\t/**\n\t * Updates the product description in the assessment and marks it as refreshed.\n\t *\n\t * @param {string} productDescription The new product description.\n\t *\n\t * @returns {void}\n\t */\n\tupdateProductDescription( productDescription ) {\n\t\tthis._productDescriptionAssessment.updateProductDescription( productDescription );\n\n\t\tthis._worker.refreshAssessment( ASSESSMENT_NAME, PLUGIN_NAME );\n\t}\n}\n\nconst wooCommerceWorker = new yoastseo_woo_worker_WooCommerceWorker();\n\nwooCommerceWorker.register();\n\n\n//# sourceURL=webpack:///./js/src/yoastseo-woo-worker.js_+_1_modules?");

/***/ })
/******/ ]);