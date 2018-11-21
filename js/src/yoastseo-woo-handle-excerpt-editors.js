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
export function getExcerpt() {
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
	console.log( `excerpt: ${excerpt}` );

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
export function addExcerptEventHandlers( worker ) {
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
		tinyMCE.on( "AddEditor", ( event ) => {
			// Switched to excerpt Visual editor.
			if ( event.editor.id === "excerpt" ) {
				addVisualEditorEventHandlers( worker );
			}
		} );
	}
}
