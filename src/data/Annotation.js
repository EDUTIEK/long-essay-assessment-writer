/**
 * PDF Annotation
 */
class Annotation {

  /**
   * Key of the pdf resource
   * @type {string}
   */
  resource_key = '';

  /**
   * key of the annotation within the pdf document
   * @type {string}
   */
  local_key = '';

  /**
   * Number of the parent (page or paragraph)
   * @type {number}
   */
  parent_number = 0

  /**
   * Raw annotation data
   * @type {object}
   */
  value = {};


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
    if (data.parent_number !== undefined && data.parent_number !== null) {
      this.parent_number = data.parent_number
    }
    if (data.local_key !== undefined && data.local_key !== null) {
      this.local_key = data.local_key
    }
    if (data.value !== undefined && data.value !== null) {
      this.value = data.value;
    }
  }

  /**
   * Get a plain data object from the public properties
   * @returns {object}
   */
  getData() {
    return {
      resource_key: this.resource_key,
      local_key: this.local_key,
      parent_number: this.parent_number,
      value: this.value
    }
  }


  /**
   * @return {string}
   */
  getKey() {
    return 'ANNO-' + this.resource_key + '-' + this.local_key
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
