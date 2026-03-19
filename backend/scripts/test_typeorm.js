const { DataSource } = require('typeorm');
const { User } = require('./src/users/user.entity');
const dotenv = require('dotenv');
dotenv.config();

const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "webxemay",
    entities: [User],
    synchronize: false,
});

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
        process.exit(0);
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
        process.exit(1);
    });
