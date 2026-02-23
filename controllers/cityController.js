const express = require('express');
const cityService = require('../src/services/cityService');

const router = express.Router();

router.get('/get', async (req, res) => {
    try {
	    const cities = await cityService.getAllCities();
		res.json(cities);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
});


module.exports = router;
