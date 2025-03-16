const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    createGoal,
    updateTodoStatus,
    getPatientGoals
} = require('../controllers/GoalController');


router.post('/', createGoal);
router.put('/todo/:todoId', updateTodoStatus);
router.get('/patient/:patientId', getPatientGoals);

module.exports = router; 