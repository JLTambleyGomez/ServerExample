const { Sequelize } = require("sequelize");
const { DataTypes } = require("sequelize");

const fs = require("fs");
const path = require("path");

require("dotenv").config(); // para recibir las constantes de .env
const { DB_DEPLOY } = process.env;


// DEPLOYMENT:
const sequelize = new Sequelize(
         DB_DEPLOY,    {
        logging: false,
        native: false,
    }
);





const basename = path.basename(__filename);

const modelDefiners = [];

fs.readdirSync(path.join(__dirname, "/models"))
    .filter(
        (file) =>
            file.indexOf(".") !== 0 &&
            file !== basename &&
            file.slice(-3) === ".js"
    )
    .forEach((file) => {
        modelDefiners.push(require(path.join(__dirname, "/models", file)));
    });

modelDefiners.forEach((model) => model(sequelize));

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
    entry[0][0].toUpperCase() + entry[0].slice(1),
    entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);


const { Country,Activity } = sequelize.models;

// Aca vendrian las relaciones

User.hasMany(Review, { foreignKey: "userId" });
Review.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Project, { foreignKey: "userId" });
Project.belongsTo(User, { foreignKey: "userId" });

Project.hasMany(Review, { foreignKey: "projectId" });
Review.belongsTo(Project, { foreignKey: "projectId" });

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize,     // para importart la conexión { conn } = require('./db.js');
};
