/**
 * PDF Annotation
 */
class Annotation {

  static KEY_INSTRUCTIONS = 'instructions';

  /**
   * Build an annotation key
   * @param {string} resource_key
   * @param {string} mark_key
   * @returns {string}
   */
  static buildKey(resource_key, mark_key) {
    return 'ANNO-' + resource_key + '-' + mark_key
  }

  /**
   * Get a minimal annotation from an annotation key
   * This is used to create the playload of a delete change
   * @param {string} key
   * @returns {Annotation}
   */
  static getFromKey(key) {
    const parts = key.split('-');
    return new Annotation({
          resource_key: parts[1],
          mark_key: parts[2] + '-' + parts[3],
        }
    );
  }

  static compare(annotation1, annotation2) {
    if (annotation1.resource_key < annotation2.resource_key) {
      return -1;
    } else if (annotation1.resource_key > annotation2.resource_key) {
      return 1;
    } else if (annotation1.parent_number < annotation2.parent_number) {
      return -1;
    } else if (annotation1.parent_number > annotation2.parent_number) {
      return 1;
    } else if (annotation1.start_position < annotation2.start_position) {
      return -1;
    } else if (annotation1.start_position > annotation2.start_position) {
      return 1;
    } else {
      return 0;
    }
  }

  /**
   * Key of the pdf resource
   * @type {string}
   */
  resource_key = '';

  /**
   * key of the mark within the pdf document
   * @type {string}
   */
  mark_key = '';

  /**
   * Raw kark data in the pdf document
   * @type {object}
   */
  mark_value = {};

  /**
   * Number of the parent (page or paragraph)
   * @type {number}
   */
  parent_number = 0

  /**
   * Number of start position (only for text marks)
   * @type {number}
   */
  start_position = 0;

  /**
   * Number of start position (only for text marks)
   * @type {number}
   */
  end_position = 0;

  /**
   * Comment for this annotation
   * @type {string}
   */
  comment = null;

  /**
   * Annotation label (not stored, renumbered when annotations are added or deleted)
   * @type {string}
   */
  label = '';

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
    if (data.resource_key !== undefined && data.resource_key !== null) {
      this.resource_key = data.resource_key.toString();
    }
    if (data.mark_key !== undefined && data.mark_key !== null) {
      this.mark_key = data.mark_key
    }
    if (data.mark_value !== undefined && data.mark_value !== null) {
      this.mark_value = data.mark_value;
    }
    if (data.parent_number !== undefined && data.parent_number !== null) {
      this.parent_number = data.parent_number
    }
    if (data.start_position !== undefined && data.start_position !== null) {
      this.start_position = data.start_position
    }
    if (data.end_position !== undefined && data.end_position !== null) {
      this.end_position = data.end_position
    }
    if (data.comment !== undefined && data.comment !== null) {
      this.comment = data.comment
    }
  }

  /**
   * Get a plain data object from the public properties
   * @returns {object}
   */
  getData() {
    return {
      resource_key: this.resource_key,
      mark_key: this.mark_key,
      mark_value: this.mark_value,
      parent_number: this.parent_number,
      start_position: this.start_position,
      end_position: this.end_position,
      comment: this.comment
    }
  }


  /**
   * @return {string}
   */
  getKey() {
    return Annotation.buildKey(this.resource_key, this.mark_key);
  }


  getSignature() {
    return JSON.stringify(this.getData());
  }

  /**
   * Get a clone of the object
   * @returns {Summary}
   */
  getClone() {
    return new Annotation(this.getData());
  }
}

export default Annotation;
