'use strict';
/*globals it,expect,describe,jasmine,beforeEach,afterEach */
var fs = require('fs');

var EncryptedFile = require('../../src/jsEncryptedFile');

describe('EncryptedFile', function () {

  it('should be defined', function () {
    expect(EncryptedFile).toBeDefined();
  });

  it('should be a function', function () {
    expect(EncryptedFile).toEqual(jasmine.any(Function));
  });


  it('should be a constructor', function () {
    expect(EncryptedFile.prototype.constructor).toBe(EncryptedFile);
  });


  describe('Encrypted File (plain)', function () {

    var encFile;
    var encFileEmpty;
    var encFileB;
    var options = {fileName: 'data/test.txt', encryptedFileName: 'data/test.bin', encrypt: false};

    beforeEach(function () {

      var EmptyOptions = {fileName: 'data/notexistent.txt', encryptedFileName: 'data/notexistent.bin', encrypt: false};
      encFile = new EncryptedFile(options);
      encFileEmpty = new EncryptedFile(EmptyOptions);

    });

    afterEach(function(){
      if (fs.existsSync('data/test.bin')) {
        fs.unlinkSync('data/test.bin');
      };
      if (fs.existsSync('data/test.txt')) {
        fs.unlinkSync('data/test.txt');
      };
    });

    it('Plain file should be a function', function () {
      expect(encFile).toEqual(jasmine.any(Object));
    });

    it('Plain file should have a read method ', function () {
      expect(encFile.read).toEqual(jasmine.any(Function));
    });

    it('Plain file should have a write method ', function () {
      expect(encFile.write).toEqual(jasmine.any(Function));
    });

    it('Plain file should have a fileName property', function () {
      expect(encFile.fileName).toBeDefined();
    });

    it('Plain file should have a fileName property', function () {
      expect(encFile.fileName).toBeDefined();
    });

    it('Reading a not-existent file should return an empty object', function () {
      var file = encFileEmpty.read();
      expect(file).toEqual({});
    });

    it('writing an object should create a json copy of the object', function () {
      var o = {a: 'a_value', b: 12};
      encFile.write(o);
      encFileB = new EncryptedFile(options);
      var o2 = encFileB.read();
      expect(o).toEqual(o2);
    });


    it('Reading a new file should return a new object', function () {
      var o = {a: 'a_value', b: 12};
      encFile.write(o);
      encFileB = new EncryptedFile(options);
      var o2 = encFileB.read();
      o2.a = 'b';
      expect(o.a).not.toEqual(o2.a);
    });

    it('Reading same file should return same object if available', function () {
      var o = {a: 'a_value', b: 12};
      encFile.write(o);
      var o2 = encFile.read();
      o2.a = 'b';
      expect(o.a).toEqual(o2.a);
    });

  });


  describe('Encrypted File (encrypted)', function () {

    var encFile;
    var encFileEmpty;
    var encFileB;
    var options = {fileName: 'data/enctest.txt', encryptedFileName: 'data/enctest.bin', encrypt: true, decrypt: false};

    beforeEach(function () {

      var emptyOptions = {fileName: 'data/enctest.txt',
        encryptedFileName: 'data/notexistentcr.bin',
        encrypt: true,
        decrypt: false};
      if (fs.existsSync('data/enctest.txt')) {
        fs.unlinkSync('data/enctest.txt');
      }

      encFile = new EncryptedFile(options);
      encFileEmpty = new EncryptedFile(emptyOptions);

    });

    afterEach(function () {
      expect(fs.existsSync('data/enctest.txt')).toBeFalsy();
      if (fs.existsSync('data/enctest.bin')) {
        fs.unlinkSync('data/enctest.bin');
      }
    });

    it('Encrypted file should be a function', function () {
      expect(encFile).toEqual(jasmine.any(Object));
    });

    it('Encrypted file should have a read method ', function () {
      expect(encFile.read).toEqual(jasmine.any(Function));
    });

    it('Encrypted file should have a write method ', function () {
      expect(encFile.write).toEqual(jasmine.any(Function));
    });

    it('Encrypted file should have a fileName property', function () {
      expect(encFile.fileName).toBeDefined();
    });

    it('Encrypted file should have a fileName property', function () {
      expect(encFile.fileName).toBeDefined();
    });

    it('Reading a not-existent file should return an empty object', function () {
      var file = encFileEmpty.read();
      expect(file).toEqual({});

    });

    it('writing an object should create a json copy of the object', function () {
      var o = {a: 'a_value', b: 12, c: [1, 2, 3, 4, 5]};
      encFile.write(o);
      encFileB = new EncryptedFile(options);
      var o2 = encFileB.read();
      expect(o).toEqual(o2);
    });


    it('Reading a new file should return a new object', function () {
      var o = {a: 'a_value', b: 12};
      encFile.write(o);
      encFileB = new EncryptedFile(options);
      var o2 = encFileB.read();
      o2.a = 'b';
      expect(o.a).not.toEqual(o2.a);
    });

    it('Reading same file should return same object if available', function () {
      var o = {a: 'a_value', b: 12};
      encFile.write(o);
      var o2 = encFile.read();
      o2.a = 'b';
      expect(o.a).toEqual(o2.a);
    });

    it('Multiple calls to write/read should not generate errors', function () {
      var i;
      for (i = 0; i < 10; i++) {
        var enc = new EncryptedFile(options);
        var xx = enc.read();
        xx.index = i;
        enc.write(xx);
        var enc2 = new EncryptedFile(options);
        var xx2 = enc2.read();
        expect(xx2.index).toBe(i);
      }
    });

    it('plain file should not be created', function () {
      expect(fs.existsSync('data/enctest.txt')).toBeFalsy();
    });
  });

});

