const express = require('express');
const supplierService = require('../src/services/supplierService');

const router = express.Router();


router.post('/insert', async (req, res) => {
	try {
		const data = req.body;
		const result = await supplierService.insertSupplier(data);
		res.json({message: 'Supplier inserted successfully', result});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
})

router.put('/update', async (req, res) => {
	try {
		const data = req.body;
		const result = await supplierService.updateSupplier(data);
		res.json({message: 'Supplier updated successfully', result});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
})

router.get('/get', async (req, res) => {
	try {
		const suppliers = await supplierService.getAllSuppliers();
		res.status(200).json({suppliers: suppliers});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
})

// router.get('/getSupplier', async (req, res) => {
// 	try {
// 		const supplier = await supplierService.getSupplier();
// 		res.status(200).json({supplier: supplier});
// 	} catch (error) {
// 		res.status(500).json({error: error.message});
// 	}
// })

router.delete('/delete', async (req, res) => {
	try {
		const supplierId = req.body;
		await supplierService.deleteSupplier(supplierId);
		res.status(200).json({message: 'Supplier deleted successfully'});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
})


module.exports = router;