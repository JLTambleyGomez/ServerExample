const server = require("./src/server");
const { conn } = require("./src/db.js");
require("dotenv").config(); // para recibir las constantes de .env
const PORT = process.env.PORT || 3001;

conn.sync({ alter:true})
    .then(() => {
        server.listen(PORT,"0.0.0.0",() => {
            console.log(`Server listening on port ${PORT}`);
        });
    })
    .catch((error) => console.error(error));    