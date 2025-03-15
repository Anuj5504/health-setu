const mongoose = require('mongoose');
const Goal = require('../models/GoalModel');
const Todo = require('../models/TodosModel');
const Patient = require('../models/PatientModel');

const createGoal = async (req, res) => {
    try {
        const { patientId, date, todos } = req.body;

        // Validate patient exists
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ msg: "Patient not found" });
        }

        // Create todos first
        const todoPromises = todos.map(todo => {
            return new Todo({
                title: todo.title,
                description: todo.description,
                status: "pending"
            }).save();
        });

        const savedTodos = await Promise.all(todoPromises);
        const todoIds = savedTodos.map(todo => todo._id);

        // Create goal with patient reference
        const goal = new Goal({
            patient: patientId,
            date: new Date(date),
            todos: todoIds
        });

        await goal.save();

        // Return complete data
        res.status(201).json({
            goal,
            todos: savedTodos
        });
    } catch (err) {
        console.error('Error creating goal:', err);
        res.status(500).json({
            error: err.message,
            msg: "Failed to create goal and todos"
        });
    }
};

const updateTodoStatus = async (req, res) => {
    try {
        const { todoId } = req.params;
        const { status } = req.body;

        const todo = await Todo.findById(todoId);
        if (!todo) {
            return res.status(404).json({ msg: "Todo not found" });
        }

        todo.status = status;
        await todo.save();
        res.json(todo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getPatientGoals = async (req, res) => {
    try {
        const { patientId } = req.params;

        console.log('Fetching goals for patient:', patientId);

        // Validate patientId format
        if (!mongoose.Types.ObjectId.isValid(patientId)) {
            console.log('Invalid patient ID format:', patientId);
            return res.status(400).json({ msg: "Invalid patient ID format" });
        }

        try {
            // First check if patient exists
            const patient = await Patient.findById(patientId);
            if (!patient) {
                console.log('Patient not found:', patientId);
                return res.status(404).json({ msg: "Patient not found" });
            }

            // Fixed: Changed TodoModel to TodosModel in the populate call
            const goals = await Goal.find({ patient: patientId })
                .populate({
                    path: 'todos',
                    model: 'TodosModel', // This matches the model name in TodosModel.js
                    select: 'title description status'
                })
                .sort({ date: -1 })
                .lean()
                .exec();

            console.log('Found goals:', goals ? goals.length : 0);

            // Return empty array if no goals found
            if (!goals || goals.length === 0) {
                return res.json([]);
            }

            res.json(goals);
        } catch (dbError) {
            console.error('Database error:', dbError);
            throw dbError;
        }
    } catch (err) {
        console.error('Error in getPatientGoals:', err);
        res.status(500).json({
            error: err.message,
            msg: "Failed to fetch patient goals",
            details: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
};

module.exports = {
    createGoal,
    updateTodoStatus,
    getPatientGoals
}; 