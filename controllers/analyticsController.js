const express = require('express');
const analyticsService = require('../src/services/analyticsService');

const router = express.Router();

router.get('/products-from-city', async (req, res) => {
    const city = req.query.city;
	if (!city) {
		return res.status(400).json({error: 'City must be not null or empty'});
	}
	try {
		const products = await analyticsService.getProductsFromCity(city);
		res.status(200).json({products: products});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
})


router.get('/supplier-product-count', async (req, res) => {
	const supplierID = req.query.SID;
	try {
		const count = await analyticsService.countProductsBySupplier(supplierID);
		res.status(200).json({count: count});
	} catch (error) {
		res.status(500).json({error: error.message});
	}})


router.get('/supplier-by-product-count', async (req, res) => {
	const productCount = parseInt(req.query.productCount, 10);
	if (isNaN(productCount)) {
		return res.status(400).json({error: 'Count must be a number'});
	}
	try {
		const suppliers = await analyticsService.findSupplierByProductCount(productCount);
		res.status(200).json({suppliers: suppliers});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
})



router.get('/highest-average-product-price', async (req, res) => {
	try {
		const supplier = await analyticsService.findHighestAvgProductPriceSupplier();
		res.status(200).json({supplier: supplier});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
})


router.get('/warehouses-monitor-all-inventories', async (req, res) => {
	try {
		const warehouses = await analyticsService.findWarehousesMonitorAllInventories();
		res.status(200).json({warehouses: warehouses});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
})




module.exports = router;