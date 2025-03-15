const Patient = require('../models/PatientModel');
const Family = require('../models/FamilyModel');
const Healthpro = require('../models/HealthproModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Caregiver = require('../models/CaregiverModel');

const createjwttoken = async (user) => {
    return jwt.sign({ user }, "jwttoken", {
        expiresIn: 3600
    });
}

const createPatient = async (req, res) => {
    try {
        const { name, email, password, mobileno, address, city } = req.body;
        if (!name || !email || !password || !mobileno || !address || !city) {
            return res.status(400).json({ msg: "Please enter all fields" });
        }
        const patient = await Patient.findOne({ email });
        if (patient) {
            return res.status(400).json({ msg: "Patient already exists" });
        }
        const hashedpassword = await bcrypt.hash(password, 10);
        
        const newPatient = new Patient({
            name,
            email,
            password: hashedpassword,
            mobileno,
            address,
            city,
            familyRole:"member"
        });

        const savedPatient = await newPatient.save();
        const token = await createjwttoken(savedPatient);
        res.json({
            token,
            savedPatient
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


const loginPatient = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ msg: "Please enter all fields" });
        }
        const patient = await Patient.findOne({ email });
        if (!patient) {
            return res.status(400).json({ msg: "Patient does not exist" });
        }
        const isMatch = await bcrypt.compare(password, patient.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }
        const token = await createjwttoken(patient);
        res.json({
            token,
            Patient: {
                id: patient.id,
                name: patient.name,
                email: patient.email,
                family: patient.family,
                familyRole: patient.familyRole
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const createFamily = async (req, res) => {
    try {
        const { name, houseid, password } = req.body;
        if (!name || !houseid || !password) {
            return res.status(400).json({ msg: "Please enter all fields" });
        }
        const hashedpassword = await bcrypt.hash(password, 10);
        const family = await Family.findOne({ houseid });
        if (family) {
            return res.status(400).json({ msg: "Family already exists" });
        }
        const newFamily = new Family({
            name,
            houseid,
            password: hashedpassword
        });
        const savedFamily = await newFamily.save();
        res.json(savedFamily);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const createHealthpro = async (req, res) => {
    try {
        const { name, email, password , mobileno, address, city} = req.body;
        if (!name || !email || !password || !mobileno || !address || !city) {
            return res.status(400).json({ msg: "Please enter all fields" });
        }
        const healthpro = await Healthpro.findOne({ email });
        if (healthpro) {
            return res.status(400).json({ msg: "Admin already exists" });
        }
        const hashedpassword = await bcrypt.hash(password, 10);
        const newHealthpro = new Healthpro({
            name,
            email,
            password: hashedpassword,
            mobileno,
            address,
            city
        });
        const savedHealthpro = await newHealthpro.save();
        const token = await createjwttoken(savedHealthpro);
        res.json({
            token,
            Healthpro: {
                id: savedHealthpro.id,
                name: savedHealthpro.name,
                email: savedHealthpro.email
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const loginHealthpro = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ msg: "Please enter all fields" });
        }
        const healthpro = await Healthpro.findOne({ email });
        if (!healthpro) {
            return res.status(400).json({ msg: "Admin does not exist" });
        }

        const isMatch = await bcrypt.compare(password, healthpro.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }
        const token = await createjwttoken(healthpro);
        res.json({
            token,
            Healthpro: {
                id: healthpro.id,
                name: healthpro.name,
                email: healthpro.email
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const joinFamily = async (req, res) => {
    try {
        const { houseid } = req.body;
        if (!houseid) {
            return res.status(400).json({ msg: "House ID is required" });
        }
        const family = await Family.findOne({ houseid });
        if (!family) {
            return res.status(404).json({ msg: "Family does not exist" });
        }
        res.json({ familyId: family._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createCaregiver = async (req, res) => {
    try {
        const { name, email, password , mobileno, address, city} = req.body;
        if (!name || !email || !password || !mobileno || !address || !city) {
            return res.status(400).json({ msg: "Please enter all fields" });
        }
        const caregiver = await Caregiver.findOne({ email });
        if (caregiver) {
            return res.status(400).json({ msg: "Doctor already exists" });
        }
        const hashedpassword = await bcrypt.hash(password, 10);
        const newCaregiver = new Caregiver({
            name,
            email,
            password: hashedpassword,
            mobileno,
            address,
            city
        });
        const savedCaregiver = await newCaregiver.save();
        const token = await createjwttoken(savedCaregiver);
        res.json({
            token,
            Caregiver: {
                id: savedCaregiver.id,
                name: savedCaregiver.name,
                email: savedCaregiver.email
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const loginCaregiver = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ msg: "Please enter all fields" });
        }
        const caregiver = await Caregiver.findOne({ email });
        if (!caregiver) {
            return res.status(400).json({ msg: "Doctor does not exist" });
        }

        const isMatch = await bcrypt.compare(password, caregiver.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }
        const token = await createjwttoken(caregiver);
        res.json({
            token,
            Caregiver: {
                id: caregiver.id,
                name: caregiver.name,
                email: caregiver.email
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createPatient,
    loginPatient,
    createFamily,
    createHealthpro,
    loginHealthpro,
    joinFamily,
    createCaregiver,
    loginCaregiver
};

