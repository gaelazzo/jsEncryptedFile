"use strict";
/*jslint node: true */

var fs = require("fs");
var C = require('crypto-js');
var config = process.env.NODE_ENV ? (require('./env/' + process.env.NODE_ENV + '.js') || {}) : {};
var secret = config.secret || {
      key: C.enc.Hex.parse('0001020304050607'),
      iv: C.enc.Hex.parse('08090a0b0c0d0e0f'),
      pwd: 'abs!sds28a'
    };


module.exports = function () {

  /**
   * Encryptor/decryptor class
   * @class EncryptedFile
   * @param options
   * @param {string} [options.fileName] Name of the clean file to encrypt
   * @param {string} [options.encryptedFileName] name of the encrypted file
   * @param {bool} options.encrypt true if the file has to be encrypted
   * @param {bool} options.decrypt true if the file has to be decrypted
   * @param {object} [options.secret] object containing key,iv,pwd to replace the config
   * @returns {EncryptedFile}
   * @constructor
   */
  function EncryptedFile(options) {
    var secr  = options.secret || secret;
    if (this.constructor !== EncryptedFile) {
      return new EncryptedFile(options);
    }
    this.trDes = C.algo.TripleDES.createEncryptor(secr.key, { iv: secr.iv });
    this.mySecret = C.SHA3(secr.pwd).toString(C.enc.base64);
    this.fileName = options.fileName;
    this.encryptedFileName = options.encryptedFileName || options.fileName + '.bin';
    this.encrypt = options.encrypt;
    this.decrypt = options.decrypt;
    this.data = null;
  }

  EncryptedFile.prototype = {
    doEncrypt: function (mess) {return C.TripleDES.encrypt(mess, this.mySecret).toString(); },
    doDecrypt: function (mess) {return  C.TripleDES.decrypt(mess, this.mySecret).toString(C.enc.Latin1);   },
    constructor: EncryptedFile,
    /**
     *
     * @method read
     * @returns {null|*}
     */
    read: function () {
      if (this.data) {
        return this.data;
      }
      var txtFile = "{}",x;

      if (this.encrypt) {
        if (fs.existsSync(this.encryptedFileName)) {
          x = fs.readFileSync(this.encryptedFileName, {encoding: 'utf8'});
          txtFile = this.doDecrypt(x);
          if (this.decrypt) {
            fs.writeFileSync(this.fileName, this.data);
          }
        }
        //if was asked to decrypt, write the plain file
      } else {
        if (fs.existsSync(this.fileName)) {
          txtFile = fs.readFileSync(this.fileName).toString();
          //in debug mode always write the encrypted version
          fs.writeFileSync(this.encryptedFileName, this.doDecrypt(txtFile));
        }
      }
      this.data = JSON.parse(txtFile);
      return this.data;
    },
    write: function (newData) {
      if (newData!==undefined){
        this.data = newData;
      }
      var txtFile = JSON.stringify(this.data);

      if (this.encrypt) {
        fs.writeFileSync(this.encryptedFileName, this.doEncrypt(txtFile));
        if (this.decrypt) {
          fs.writeFileSync(this.fileName, txtFile);
        }
      } else {
        fs.writeFileSync(this.fileName, txtFile);
        fs.writeFileSync(this.encryptedFileName, this.doEncrypt(txtFile).toString());
      }
    }
  };


  return EncryptedFile;
};

