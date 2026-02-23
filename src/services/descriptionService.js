const db = require('../models/db');

// Insert a new description
exports.insertDescription = async (data) => {
	const sql = `INSERT INTO ProductName (Description, name)
				 		VALUES (:Description, :name)`;
	const binds = [data.description, ''];
	return db.query(sql, binds);
};

// Get all descriptions
exports.getAllDescriptions = async () => {
	const sql = `SELECT * FROM ProductName`;
	return db.query(sql);
};
