/**
 * SAving of a writing step (
 */
class WritingStep
{
    /**
     * Step is an incremental saving saving
     * true: the property content is a diff to the content before
     * false: the property content is the full content
     * @type {boolean}
     */
    is_delta = true;

    /**
     * Saving time in server time
     * @type {number}
     */
    timestamp = 0;

    /**
     * Changes or full content
     * @type {string}
     */
    content = '';

    /**
     * Hash of the last saved content
     * @type {string}
     */
    hash_before = '';

    /**
     * Hash of the newly saved content
     * @type {string}
     */
    hash_after = '';

    /**
     * Levensthein distance to the content before
     * @type {integer}
     */
    distance = 0;

    /**
     * Constructor - gets properties from a data object
     * @param {object} data
     */
    constructor(data = {}) {
        this.setData(data);
    }

    /**
     * Set the data from a plain object
     * @param {object} data
     */
    setData(data) {
        if (data.is_delta !== undefined && data.is_delta !== null) {
            this.is_delta = !!data.is_delta;
        }
        if (data.timestamp !== undefined && data.timestamp !== null) {
            this.timestamp = parseInt(data.timestamp);
        }
        if (data.content !== undefined && data.content !== null) {
            this.content =data.content.toString()
        }
        if (data.hash_before !== undefined && data.hash_before !== null) {
            this.hash_before =data.hash_before.toString()
        }
        if (data.hash_after !== undefined && data.hash_after !== null) {
            this.hash_after =data.hash_after.toString()
        }
        if (data.distance !== undefined && data.distance !== null) {
            this.distance = parseInt(data.distance);
        }
    }

    /**
     * Get a plain data object from the public properties
     * @returns {object}
     */
    getData() {
        return {
            is_delta: this.is_delta,
            timestamp: this.timestamp,
            content: this.content,
            hash_before: this.hash_before,
            hash_after: this.hash_after,
            distance: this.distance
        }
    }
}

export default WritingStep;