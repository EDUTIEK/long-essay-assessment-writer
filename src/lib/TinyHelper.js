import tinymce from "tinymce";
import {useSettingsStore} from "@/store/settings";
import {useClipbardStore} from "@/store/clipboard";
import {usePreferencesStore} from "@/store/preferences";
import {nextTick, ref, watch} from 'vue';

let settingsStore;
let clipboardStore;
let preferencesStore;

export default class TinyHelper {

    editor_id = null;
    editor = null;

    wordCount = ref(0);
    characterCount = ref(0);

    constructor(editor_id) {
        this.editor_id = editor_id;

        settingsStore = useSettingsStore();
        clipboardStore = useClipbardStore();
        preferencesStore = usePreferencesStore();
    }

    getInit() {
        return {
            license_key: 'gpl',
            language: 'de',
            height: '100%',
            menubar: false,
            statusbar: false,
            plugins: 'lists charmap wordcount',
            toolbar: settingsStore.tinyToolbar,
            valid_elements: settingsStore.tinyValidElements,
            formats: settingsStore.tinyFormats,
            style_formats: settingsStore.tinyStyles,
            custom_undo_redo_levels: 10,
            text_patterns: false,
            skin: 'default',
            content_css: 'default',
            content_style: settingsStore.tinyContentStyle,
            browser_spellcheck: settingsStore.allow_spellcheck,
            highlight_on_focus: true,
            iframe_aria_text: 'Editor Abgabe-Text',
            paste_as_text: false,         // keep formats when copying between clipboards
            paste_block_drop: true,       // prevent unfiltered content from drag & drop
            paste_merge_formats: true,    // default
            paste_tab_spaces: 4,          // default
            smart_paste: false,           // don't create hyperlinks automatically
            paste_data_images: false,     // don't paste images
            paste_remove_styles_if_webkit: true,  // default
            paste_webkit_styles: 'none',          // default
            paste_preprocess: this.handlePaste
        }
    }

    /**
     * Init the editor
     * To be called from the init event handler
     * Can't be used directly used as handler
     */
    init() {
        this.editor = tinymce.get(this.editor_id);
        this.applyZoom();
        this.applyFormat();
        this.applyWordCount();
    }

    /**
     * Handle copy to the clipboard
     * @param {ClipboardEvent} event
     */
    handleCopy(event) {
        clipboardStore.setContent(event.clipboardData.getData('text/html'));
    }

    /**
     * Check if paste is allowed (called from tiny plugin)
     */
    handlePaste(plugin, args) {
        if (!clipboardStore.getPasteAllowed(args.content)) {
            args.content = '';
            clipboardStore.showWarning();
        }
    }

    /**
     * Set the focus to the editor
     */
    async applyFocus() {
        try {
            await nextTick();
            this.editor.focus();
        } catch (e) {
        }
    }

    /**
     * Add classes for the headline styles to the overlay element of the tiny menu
     */
    applyFormat() {
        for (const element of document.getElementsByClassName('tox-tinymce-aux')) {
            element.classList.add(settingsStore.contentClass);
        }
    }

    /**
     * Apply a zoom level to the elements in the editor
     */
    applyZoom() {
        try {
            this.editor.dom.setStyle(this.editor.dom.doc.body, 'font-size', (preferencesStore.editor_zoom) + 'rem');
            this.editor.dom.setStyle(this.editor.dom.select('h1'),
                'font-size',
                (preferencesStore.editor_zoom * settingsStore.tinyH1Size) + 'rem');
            this.editor.dom.setStyle(this.editor.dom.select('h2'),
                'font-size',
                (preferencesStore.editor_zoom * settingsStore.tinyH2Size) + 'rem');
            this.editor.dom.setStyle(this.editor.dom.select('h3'), 'font-size', (preferencesStore.editor_zoom) + 'rem');
            this.editor.dom.setStyle(this.editor.dom.select('h4'), 'font-size', (preferencesStore.editor_zoom) + 'rem');
            this.editor.dom.setStyle(this.editor.dom.select('h5'), 'font-size', (preferencesStore.editor_zoom) + 'rem');
            this.editor.dom.setStyle(this.editor.dom.select('h6'), 'font-size', (preferencesStore.editor_zoom) + 'rem');
        } catch (e) {
        }
    }

    /**
     * Fix for dragon extension in chrome browser
     */
    applyScrolling() {
        try {
            this.editor.selection.getNode().scrollIntoView(false);
        } catch (e) {
        }
    }

    /**
     * Update the word counter
     */
    applyWordCount() {
        try {
            const plugin = this.editor.plugins.wordcount;
            this.wordCount.value = plugin.body.getWordCount();
            this.characterCount.value = plugin.body.getCharacterCount();
        } catch (e) {
        }
    }
}
