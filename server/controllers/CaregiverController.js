const caregiver = require('../models/CaregiverModel');
const healthpro = require('../models/HealthproModel');
const patient = require('../models/PatientModel');
const family = require('../models/FamilyModel');
const disease = require('../models/DiseaseModel');
const goal = require('../models/GoalModel');
const appointment = require('../models/AppoinmentModel');

 const getCaregivers = async (req, res) => {
    try{
        const caregivers = await caregiver.find();
        res.json(caregivers);
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

 const getCaregiverById = async (req, res) => {
    try{
        const {id} = req.params;
        const caregiverInfo = await caregiver.findById(id);
        res.json(caregiverInfo);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
}

module.exports = {
    getCaregivers,
    getCaregiverById,
}; 

