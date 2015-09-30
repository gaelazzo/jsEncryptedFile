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


## read() ##
Reads the file and returns the data read. If data has already been read, returns the in-memory instance of the read data



## write([data]) ##
Writes the file eventually replacing the inline-copy of the data when the argument is given


