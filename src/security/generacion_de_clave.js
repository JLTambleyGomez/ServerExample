const crypto = require('crypto');

const generateSecretKey = async (lengthInBytes) => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(lengthInBytes, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer.toString('hex'));
      }
    });
  });
};

// Longitud de la clave en bytes (256 bits)
const keyLengthInBytes = 32;

generateSecretKey(keyLengthInBytes)
  .then((secretKey) => {
    console.log(secretKey);
    return secretKey

  })
  .catch((err) => {
    console.error('Error al generar la clave:', err);
  });

module.exports = generateSecretKey; 
