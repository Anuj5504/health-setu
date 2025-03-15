const express = require('express');
const router = express.Router();
const { getCaregivers, getCaregiverById } = require('../controllers/CaregiverController');

router.get('/', getCaregivers);

router.get('/:id', getCaregiverById);

module.exports = router;
