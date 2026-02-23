const express = require('express');
const productService = require('../src/services/productService');

const router = express.Router();


router.post('/insert', async (req, res) => {
	try {
		const data = req.body;
		const result = await productService.insertProduct(data);
		res.status(200);
		res.json({message: 'Product inserted successfully', result});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
})


router.post('/update', async (req, res) => {
	try {
		const data = req.body;
		console.log(data)
		const result = await productService.updateProduct(data);
		console.log(result);
		res.status(200).json({message: 'Product updated successfully', result: result});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
})

router.get('/selection', async (req, res) => {
	try {
		const filters = req.query.filters;
		const products = await productService.filterProducts(filters);
		res.json(products);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
})

router.get('/projection', async (req, res) => {
	try {
		const attributes = req.query.attributes;
		const projection = await productService.projectProducts(attributes);
		res.status(200).json({projection: projection});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
})

router.get('/get', async (req, res) => {
	try {
		const products = 
		await productService.getAllProducts();
		res.status(200).json({products: products});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
})

router.post('/select', async (req, res) => {
	try {
		const query = req.body.queryString;
		const products = await productService.selectProducts(query);
		res.status(200).json({products: products});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
})

module.exports = router;