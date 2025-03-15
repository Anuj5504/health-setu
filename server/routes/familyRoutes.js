const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    createFamily,
    addFamilyMember,
    getFamilyMembers,
    updateFamilyMemberRole
} = require('../controllers/FamilyController');

router.post('/', createFamily);
router.post('/:familyId/members', auth, addFamilyMember);
router.get('/:familyId/members', auth, getFamilyMembers);
router.put('/members/:memberId/role', auth, updateFamilyMemberRole);

module.exports = router; 