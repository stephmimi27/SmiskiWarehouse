const db = require('../models/db');

// Insert a new supplier
exports.insertSupplier = async (data) => {
	const sql = `INSERT INTO Supplier (SID, Address, PostalCode)
                 		VALUES (:SID, :Address, :PostalCode)`;
	const binds = [data.sid, '', ''];
	return db.query(sql, binds);
};

// Update an existing supplier
exports.updateSupplier = async (data) => {
	const sql = `UPDATE Supplier
			SET Address = :Address, PostalCode = :PostalCode
			WHERE SID = :SID`;
	const binds = [data.address, data.postalCode, data.sid];
	return db.query(sql, binds);
};

// Retrieve all suppliers
exports.getAllSuppliers = async () => {
	const sql = `SELECT * FROM Supplier`;
	return db.query(sql);
};

// Delete a supplier by SID
exports.deleteSupplier = async (supplierId) => {
	const sql = `DELETE FROM Supplier WHERE SID = :SID`;
	return db.query(sql, [supplierId.SID]);
};

// exports.getSupplier = async (supplierId) => {
// 	const sql = 'SELECT FROM Supplier WHERE SID = :SID';
// 	return db.query(sql, [supplierId.SID]);
// }
