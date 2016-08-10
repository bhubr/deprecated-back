import crypto from 'crypto';

export default {
  gen: function(len) {
    if (len === undefined) len = 16;
    return crypto.randomBytes(Math.ceil(len/2))
      .toString('hex') // convert to hexadecimal format
      .slice(0,len);   // return required number of characters
  }
}
