import * as CryptoJS from 'crypto-js';

const SECRET_KEY = 'mySuperSecretKey123!'; 

function insertpoiu(base64: string): string {
  return base64.slice(0, 3) + "poiu" + base64.slice(3);
}
function removepoiu(modified: string): string {
  return modified.replace("poiu", "");
}

export function encryptMessage(message: string): string {
  const cipher = CryptoJS.AES.encrypt(message, SECRET_KEY).toString();
  return insertpoiu(cipher); 
}

export function decryptMessage(cipherText: string): string {
  try {
    const normalCipher = removepoiu(cipherText); 
    const bytes = CryptoJS.AES.decrypt(normalCipher, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    console.error("Decryption failed", e);
    return '';
  }
}
