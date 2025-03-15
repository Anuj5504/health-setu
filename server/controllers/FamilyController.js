const Family = require('../models/FamilyModel');
const Patient = require('../models/PatientModel');
const { generateToken } = require('../utils/tokenUtils');

const createFamily = async (req, res) => {
    try {
        const { name, houseid, password } = req.body;
        
        const existingFamily = await Family.findOne({ houseid });
        if (existingFamily) {
            return res.status(400).json({ msg: "House ID already exists" });
        }

        const family = new Family({
            name,
            houseid,
            password,
            members: []
        });

        await family.save();
        const token = generateToken(family);
        res.status(201).json({ family, token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const addFamilyMember = async (req, res) => {
    try {
        const { familyId } = req.params;
        const { name, email, password, role } = req.body;

        const family = await Family.findById(familyId);
        if (!family) {
            return res.status(404).json({ msg: "Family not found" });
        }

        const patient = new Patient({
            name,
            email,
            password,
            family: familyId,
            familyRole: role || 'member'
        });

        await patient.save();
        family.members.push(patient._id);
        await family.save();

        res.status(201).json(patient);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getFamilyMembers = async (req, res) => {
    try {
        const { familyId } = req.params;
        const family = await Family.findById(familyId)
            .populate('members', 'name email familyRole');
        if (!family) {
            return res.status(404).json({ msg: "Family not found" });
        }
        res.json(family.members);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateFamilyMemberRole = async (req, res) => {
    try {
        const { memberId } = req.params;
        const { role } = req.body;

        const patient = await Patient.findById(memberId);
        if (!patient) {
            return res.status(404).json({ msg: "Family member not found" });
        }

        patient.familyRole = role;
        await patient.save();
        res.json(patient);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createFamily,
    addFamilyMember,
    getFamilyMembers,
    updateFamilyMemberRole
};




