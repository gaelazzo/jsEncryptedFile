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
    var options = {fileName: 'test/test.txt', encryptedFileName: 'test/test.bin', encrypt: false};

    beforeEach(function () {

      var EmptyOptions = {fileName: 'test/notexistent.txt', encryptedFileName: 'test/notexistent.bin', encrypt: false};
      encFile = new EncryptedFile(options);
      encFileEmpty = new EncryptedFile(EmptyOptions);

    });

    afterEach(function(){
      if (fs.existsSync('test/test.bin')) {
        fs.unlinkSync('test/test.bin');
      };
      if (fs.existsSync('test/test.txt')) {
        fs.unlinkSync('test/test.txt');
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
    var options = {fileName: 'test/enctest.txt', encryptedFileName: 'test/enctest.bin', encrypt: true, decrypt: false};

    beforeEach(function () {

      var emptyOptions = {fileName: 'test/enctest.txt',
        encryptedFileName: 'test/notexistentcr.bin',
        encrypt: true,
        decrypt: false};
      if (fs.existsSync('test/enctest.txt')) {
        fs.unlinkSync('test/enctest.txt');
      }

      encFile = new EncryptedFile(options);
      encFileEmpty = new EncryptedFile(emptyOptions);

    });

    afterEach(function () {
      expect(fs.existsSync('test/enctest.txt')).toBeFalsy();
      if (fs.existsSync('test/enctest.bin')) {
        fs.unlinkSync('test/enctest.bin');
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
      expect(fs.existsSync('test/enctest.txt')).toBeFalsy();
    });


    it('After writing crypted, reading will get that object', function () {
      encFileB = new EncryptedFile({encryptedFileName: 'test/testCrypt.bin'});
      var o = {a: 'a_value', b: 12};
      encFileB.write(o);
      var encFileB2 = new EncryptedFile({encryptedFileName: 'test/testCrypt.bin'});
      var o2 = encFileB2.read();
      expect(o).toEqual(o2);
      if (fs.existsSync('test/testCrypt.bin')) {
        fs.unlinkSync('test/testCrypt.bin');
      }
    });
  });

});

