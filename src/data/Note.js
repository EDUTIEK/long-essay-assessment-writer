/**
 * Writing Note
 */
class Note {


  /**
   * Number of the notice board
   * @type {number}
   */
  note_no = 0;

  /**
   * Note text
   * @type {string}
   */
  note_text = '';

  /**
   * Timestamp of the last change (server time)
   * @type {integer}
   */
  last_change = null;


  /**
   * Constructor - gets properties from a data object
   * @param {object} data
   */
  constructor(data = {}) {
    this.setData(data);
  }

  static getKeyForNo(note_no) {
   return 'NOTE_' +  note_no;
  }

  /**
   * Set the data from a plain object
   * @param {object} data
   */
  setData(data) {
    if (data.note_no !== undefined && data.note_no !== null) {
      this.note_no = parseInt(data.note_no);
    }
    if (data.note_text !== undefined && data.note_text !== null) {
      this.note_text = data.note_text.toString()
    }
    if (data.last_change !== undefined && data.last_change !== null) {
      this.last_change = parseInt(data.last_change);
    }
  }

  /**
   * Get a plain data object from the public properties
   * @returns {object}
   */
  getData() {
    return {
      note_no: this.note_no,
      note_text: this.note_text,
      last_change: this.last_change
    }
  }


  /**
   * @return {string}
   */
  getKey() {
    return Note.getKeyForNo(this.note_no);
  }


  /**
   * Get a clone of the object
   * @returns {Summary}
   */
  getClone() {
    return new Note(this.getData());
  }

  /**
   * Check if this object is equal to another summary
   * @param other
   */
  isEqual(other) {
    for (const key in this) {
      if (this[key] !== other[key]) {
        return false;
      }
    }
    return true;
  }
}

export default Note;
