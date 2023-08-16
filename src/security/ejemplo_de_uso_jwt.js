const jwt = require('jsonwebtoken');

const secretKey = '74c34fd7fc6387114a5f750bf129b3b409bf854b9aa38f9df92f7d980c83e0fa'; // Reemplaza esto con una clave secreta más segura en producción

const payload = {
  sub: '1234567890',
  name: 'John Doe',
  admin: true
};

const token = jwt.sign(payload, secretKey, { algorithm: 'HS256' });

console.log(token);
