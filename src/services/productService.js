const db = require('../models/db');

exports.insertProduct = async (data) => {
	const sql = `INSERT INTO Product (PID, Name, Description, UnitPrice, MinimumOrder, SID) 
						VALUES (:PID, :Name, :Description, :UnitPrice, :MinimumOrder, :SID)`;

	const binds = [data.PID, data.Name, data.Description, data.UnitPrice, data.MinimumOrder, data.SID];
	console.log(binds);
	return await db.query(sql, binds);
};

exports.updateProduct = async (data) => {
	console.log(data);
	const sql = `UPDATE Product 
			SET Name = :Name,
			Description = :Description, 
			UnitPrice = :UnitPrice,
			MinimumOrder = :MinimumOrder, 
			SID = :SID
			WHERE PID = :PID`;
	console.log(sql)
	const binds = [data.Name, data.Description, data.UnitPrice, data.MinimumOrder, data.SID, data.PID];
	
	return await db.query(sql, binds);
};

exports.filterProducts = async (filters) => {
	let sql = 'SELECT * FROM Product';
	const whereClauses = [];
	const bindParams = [];

	filters.forEach((filter, index) => {
		const { attribute, value, logic } = filter;
		const paramName = `${attribute}${index}`; 
		
		whereClauses.push(`${attribute} = :${paramName}`);
		bindParams[index] = value;
		
		if (logic && index < filters.length - 1) {
			whereClauses.push(logic); 
		}
	});

	if (whereClauses.length > 0) {
		sql += ' WHERE ' + whereClauses.join(' ');
	}

	return await db.query(sql, bindParams);
	// console.log(result);
	// return result.rows;
};

exports.projectProducts = async (attributes) => {
	const sql = `SELECT ${attributes} FROM Product`;
	return await db.query(sql);
};

exports.getAllProducts = async () => {
	const sql = `SELECT * FROM Product`;
	return await db.query(sql);
};

exports.selectProducts = async (query) => {
	const sql = `SELECT * FROM Product WHERE ${query}`;
	return await db.query(sql);
};
