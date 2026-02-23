const db = require('../models/db');

// JOIN: Find products given a city
exports.getProductsFromCity = async (city) => {
        console.log(city)
	const query = `
        SELECT p.PID, p.Name, p.Description, p.UnitPrice, p.MinimumOrder, p.SID, c.city
        FROM Product p, Supplier s, SupplierCity c
        WHERE c.city = :city AND s.PostalCode = c.PostalCode AND s.SID = p.SID`;
	return await db.query(query, [city]);
};

// // GROUP BY Aggregation: Count #products supplied by a supplier
// exports.countProductsBySupplier = async (supplierID) => {
// 	const query = `
//         SELECT s.SID AS SupplierID, COUNT(*) AS NumberOfProducts
//         FROM Product p,
//              Supplier s
//         WHERE s.SID = p.SID ${supplierID ? 'AND s.SID = :supplierID' : ''}
//         GROUP BY s.SID`;
// 	return await db.query(query, supplierID ? [supplierID] : []);
// };

// GROUP BY Aggregation: Count #products supplied by each supplier
exports.countProductsBySupplier = async () => {
	const query = `
        SELECT SID AS SupplierID, COUNT(*) AS NumberOfProducts
        FROM Product
        GROUP BY SID`;
	return await db.query(query);
};



// // GROUP BY Aggregation: Count #products supplied by a supplier
// exports.countProductsBySupplier = async (supplierID) => {
//         const query = `
//         SELECT COUNT(*)
//         FROM Product
//         WHERE SID = '${supplierID}'`;
// 	return await db.query(query);
// };

// HAVING Aggregation: Find supplier with a matching product count
exports.findSupplierByProductCount = async (productCount) => {
	const query = `
        SELECT s.SID AS SupplierID, COUNT(*) AS NumberOfProducts
        FROM Product p,
             Supplier s
        WHERE s.SID = p.SID
        GROUP BY s.SID
        HAVING COUNT(*) = :productCount`;
	return await db.query(query, [productCount]);
};

// Nested Aggregation: Find supplier with the highest average product price
exports.findHighestAvgProductPriceSupplier = async () => {
	const query = `
        SELECT s.SID AS SupplierID, AVG(p.UnitPrice) AS AvgUnitPrice
        FROM Supplier s,
             Product p
        WHERE s.SID = p.SID AND p.UnitPrice IS NOT NULL
        GROUP BY s.SID
        HAVING AVG(p.UnitPrice) >= ALL (SELECT AVG(p2.UnitPrice)
                                        FROM Product p2 
                                        WHERE p2.UnitPrice IS NOT NULL
                                        GROUP BY p2.SID)`;
	return await db.query(query);
};

// Division: Find suppliers who supply all products
exports.findWarehousesMonitorAllInventories = async () => {
	const query = `
        SELECT w.WID AS WarehouseID
        FROM Warehouse w
        WHERE NOT EXISTS (SELECT i.IID
                          FROM Inventory i
                          WHERE NOT EXISTS (SELECT ip.PID
                                            FROM Inventory ip
                                            WHERE ip.WID = w.WID
                                              AND ip.IID = i.IID))`;
	return await db.query(query);
};
