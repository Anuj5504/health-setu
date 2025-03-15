const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    createGoal,
    updateTodoStatus,
    getPatientGoals
} = require('../controllers/GoalController');

// Debug middleware
router.use((req, res, next) => {
    console.log('Goal Route Request:', {
        method: req.method,
        path: req.path,
        headers: req.headers,
        body: req.body,
        params: req.params
    });
    next();
});

router.post('/', createGoal);
router.put('/todo/:todoId', updateTodoStatus);
router.get('/patient/:patientId', getPatientGoals);

module.exports = router; 