var CryptoJS = require("crypto-js");

export function encrypt(data) {
    console.log(data)
    return CryptoJS.AES.encrypt(data, process.env.SECRET).toString();
}
