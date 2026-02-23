// const oracledb = require('oracledb');

// // Database configuration setup
// const dbConfig = {
// 	user: process.env.DB_USER,
// 	password: process.env.DB_PASSWORD,
// 	connectString: `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
// 	poolMin: 1,
// 	poolMax: 3,
// 	poolIncrement: 1,
// 	poolTimeout: 60
// };

// // Initialize connection pool: cached connections to the database
// async function initializePool() {
// 	try {
// 		await oracledb.createPool(dbConfig);
// 		console.log("Database connection pool started");
// 	} catch (err) {
// 		console.error("Error creating database connection pool:", err);
// 		throw err;
// 	}
// }

const oracledb = require('oracledb');
const loadEnvFile = require('../../utils/envUtil');

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};

// initialize connection pool
async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

// Close connection pool
async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}



initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);


// Get a connection from the pool & execute a query
async function query(sql, params = []) {
	let connection;
	// NOTE: for debug purpose
	// console.log(sql);
	
	try {
		connection = await oracledb.getConnection();
        console.log(sql);
		const result = await connection.execute(sql, params, {autoCommit: true});
		// NOTE: for debug purpose
		console.log(result);
        console.log("result");
		return result.rows;
	} catch (e) {
		console.error("Error establishing database connection:", e);
		throw e;
	} finally {
		if (connection) {
			try {
				await connection.close();
				console.log("Database connection closed");
			} catch (e) {
				console.error("Error closing database connection:", e);
			}
		}
	}
}


module.exports = {
	query
};
