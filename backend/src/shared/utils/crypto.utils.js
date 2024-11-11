import AES from 'crypto-js/aes.js';
import pkg from 'crypto-js';
const { enc } = pkg;
export class CryptoUtil {
    /**
     * Encrypts the given data using the provided encryption key.
     * @param data The data to encrypt (object or string).
     * @param encryptionKey The key used for encryption.
     * @returns The encrypted string.
     */
    static encrypt(data, encryptionKey) {
      const dataToEncrypt = typeof data === 'string' ? data : JSON.stringify(data);
      return AES.encrypt(dataToEncrypt, encryptionKey).toString();
    }
  
    /**
     * Decrypts the given encrypted data using the provided encryption key.
     * @param encryptedData The encrypted data (string).
     * @param encryptionKey The key used for decryption.
     * @returns The decrypted data (parsed object or string).
     */
    static decrypt( encryptedData, encryptionKey) {
      const decryptedBytes = AES.decrypt(encryptedData, encryptionKey);
      const decryptedString = decryptedBytes.toString(enc.Utf8);
      try {
        // Attempt to parse as JSON
        return JSON.parse(decryptedString) || decryptedString;
      } catch {
        // Return as a plain string if not JSON
        return decryptedString;
      }
    }
  }