# jsEncryptedFile
Simple utility class able to manage a cripted file.



## EncryptedFile(options) ##
Creates the encriptor/decriptor file attached to a file

   * @param options
   * @param {string} options.fileName Name of the clean file to encrypt
   * @param {string} options.encryptedFileName name of the file to be created
   * @param {bool} options.encrypt true if the file has to be encrypted
   * @param {bool} options.decrypt true if the file has to be decrypted
   * @param {object} [options.secret] object contaning key,iv,pwd to replace the config 

options.secret is an object like:

    {
    	key: C.enc.Hex.parse('0001020304050607'),
    	iv: C.enc.Hex.parse('08090a0b0c0d0e0f'),
    	pwd: '0123456789'
    }

it is also possible to set a default for this value, invoking

## setDefaultSecret(secret) ##
so subsequent calls to Encrypted() will use that value
example:

    setDefaultSecret({
    				key: C.enc.Hex.parse('0001020304050607'),
    				iv: C.enc.Hex.parse('08090a0b0c0d0e0f'),
    				pwd: 'abs!sds28a'
    });
    
## read() ##
Reads the file and returns the data read. If data has already been read, returns the in-memory instance of the read data



## write([data]) ##
Writes the file eventually replacing the inline-copy of the data when the argument is given


Usage is very simple, for example

    it('After writing crypted, reading will get that object', function () {
      var encFileB = new EncryptedFile({encryptedFileName: 'data/testCrypt.bin'});
      var o = {a: 'a_value', b: 12};
      encFileB.write(o);
      var encFileB2 = new EncryptedFile({encryptedFileName: 'data/testCrypt.bin'});
      var o2 = encFileB2.read();
      expect(o).toEqual(o2);
    });
    
![](https://travis-ci.org/gaelazzo/jsEncryptedFile.svg?branch=master)     
