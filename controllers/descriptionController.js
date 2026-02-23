const express = require('express');
const descriptionService = require('../src/services/descriptionService');

const router = express.Router();


router.post('/insert', async (req, res) => {
    try {
		const data = req.body;
		const result = await descriptionService.insertDescription(data);
		res.json({message: 'Description inserted successfully', result});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
})

router.get('/get', async (req, rest) => {
    try {
		const descriptions = await descriptionService.getAllDescriptions();
		res.json(descriptions);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
})


module.exports = router;
