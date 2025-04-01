/**
 * Resource
 */
class Resource {

  static TYPE_FILE = 'file';
  static TYPE_URL = 'url';
  static TYPE_INSTRUCTION = 'instruct';
  static TYPE_SOLUTION = 'solution';

  static ALLOWED_TYPES = [Resource.TYPE_FILE, Resource.TYPE_URL, Resource.TYPE_INSTRUCTION, Resource.TYPE_SOLUTION];

  /**
   * Key of the resource
   * @type {string}
   */
  key = '';

  /**
   * title
   * @type {string}
   */
  title = '';

  /**
   * Resource type
   * @type {string}
   */
  type = null;

  /**
   * Should the resource be shown embedded
   * @type {bool}
   */
  embedded = true

  /**
   * Source of the resource
   * File, Instructions, Solution: filename
   * URL: url
   * @type {string}
   */
  source = '';

  /**
   * URL of the resource
   * @type {string}
   */
  url = '';

  /**
   * Mime Type of the file
   * @type {string}
   */
  mimetype = '';

  /**
   * Size of the resource file
   * @type {integer}
   */
  size = null;

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
    if (data.key !== undefined && data.key !== null) {
      this.key = data.key.toString();
    }
    if (data.title !== undefined && data.title !== null) {
      this.title = data.title.toString();
    }
    if (data.type !== undefined && Resource.ALLOWED_TYPES.includes(data.type)) {
      this.type = data.type.toString();
    }
    if (data.embedded !== undefined && data.embedded !== null) {
      this.embedded = !!data.embedded;
    }
    if (data.source !== undefined && data.source !== null) {
      this.source = data.source.toString();
      if (this.type == Resource.TYPE_URL) {
        this.url = this.source
      }
    }
    if (data.url !== undefined && data.url !== null) {
      this.url = data.url.toString();
    }
    if (data.mimetype !== undefined && data.mimetype !== null) {
      this.mimetype = data.mimetype;
    }
    if (data.size !== undefined && data.size !== null) {
      this.size = parseInt(data.size);
    }
  }

  /**
   * Get a plain data object from the public properties
   * @returns {object}
   */
  getData() {
    return {
      key: this.key,
      title: this.title,
      type: this.type,
      embedded: this.embedded,
      url: this.url,
      mimetype: this.mimetype,
      size: this.size,
    }
  }

  isPdf() {
    return [Resource.TYPE_FILE, Resource.TYPE_SOLUTION, Resource.TYPE_INSTRUCTION].includes(this.type);
  }

  isExternalUrl() {
    return this.type == Resource.TYPE_URL && !this.embedded
  }

  isEmbeddedUrl() {
    return this.type == Resource.TYPE_URL && this.embedded
  }
  isEmbeddedSelectable() {
    return (this.type == Resource.TYPE_FILE || this.type == Resource.TYPE_URL && this.embedded);
  }

  hasFileToLoad() {
    return [Resource.TYPE_FILE, Resource.TYPE_SOLUTION, Resource.TYPE_INSTRUCTION].includes(this.type);
  }


  /**
   * @return {string}
   */
  getKey() {
    return this.key
  }

  getSignature() {
    return JSON.stringify(this.getData());
  }

  /**
   * Get a clone of the object
   * @returns {Resource}
   */
  getClone() {
    return new Resource(this.getData());
  }
}

export default Resource;
