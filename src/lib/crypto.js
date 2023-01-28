/**
 * Created by SooMinKim on 2023-01-21
 */
'use strict';

const crypto = require('crypto');
const config = require('../../config');

class Crypto {
    constructor () {
        this._password_secret_key = config.crypto.password_secret_key;
        this._password_iv = config.crypto.password_iv.split(' ').map((element) => Number(element));
    };

    async encrypt_aes256cbc (plainText, key, iv) {
        try {
            let encKey = key ? key : this._password_secret_key;
            let encIv = iv ? iv : Buffer.from(this._password_iv);

            let cipher = crypto.createCipheriv('aes-256-cbc', encKey, encIv);
            cipher.setAutoPadding(true);

            let cipherText = cipher.update(Buffer.from(plainText), 'utf8', 'base64');
            cipherText += cipher.final('base64');
            console.log(` : (Crypto.encrypt_aes256cbc) cipher text(${cipherText.length}) [${cipherText}]`);

            return cipherText;
        } catch (e) {
            console.log(`\n : (Crypto.encrypt_aes256cbc) Failed to encrypt \n`);
            throw e;
        }
    };

    async decrypt_aes256abc (encryptedInput, key, iv) {
        try {
            let encKey = key ? key : this._password_secret_key;
            let encIv = iv ? iv : Buffer.from(this._password_iv);

            let cipher = crypto.createDecipheriv('aes-256-cbc', encKey, encIv);

            let decipherText = cipher.update(encryptedInput, 'base64', 'utf8');
            decipherText += cipher.final('utf8');
            console.log(` : (Crypto.decrypt_aes256abc) plain text(${decipherText.length}) [${decipherText}]`);

            return decipherText;
        } catch (e) {
            console.log(`\n : (Crypto.decrypt_aes256abc) Failed to decrypt \n`);
            throw e;
        }
    };
};

module.exports = Crypto;
