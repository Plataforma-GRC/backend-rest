// Converter de hex para UTF-8
module.exports.hexToString = function (strHex) {
    const buf = Buffer.from(strHex, 'hex');
    return buf.toString('utf8');

}

module.exports.hexToUtf8 = function(hex) {
    // Helper function to convert hex to bytes
    function hexToBytes(hex) {
        let bytes = [];
        for (let c = 0; c < String(hex).length; c += 2) {
            bytes.push(parseInt(hex.substr(c, 2), 16));
        }
        return bytes;
    }

    // Helper function to convert bytes to UTF-8 string
    function bytesToUtf8(bytes) {
        let utf8 = '';
        for (let i = 0; i < String(bytes).length; i++) {
            try {
                utf8 += decodeURIComponent(encodeURIComponent(String.fromCharCode(bytes[i])));
            } catch (e) {
                utf8 += 'Z'; // Replace unconvertible byte with 'Z'
            }
        }
        return utf8;
    }

    let bytes = hexToBytes(hex);
    return bytesToUtf8(bytes);
}


// Converter de utf8 para Hex
module.exports.stringToHex = function(strUTF8) {
    const buf = Buffer.from(strUTF8, 'utf8');
    return buf.toString('hex');
}