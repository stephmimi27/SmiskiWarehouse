const db = require('../models/db');

// Get all descriptions
exports.getAllCities = async () => {
	const sql = `SELECT DISTINCT City FROM SupplierCity WHERE City IS NOT NULL`;
	return db.query(sql);
};
