const router = require('express').Router();
const User = require('../models/User');
const { auth, requireRole } = require('../middleware/auth');

// NGO: get all organizations (to select delivery target)
router.get('/organizations', auth, requireRole('ngo'), async (req, res) => {
  try {
    const orgs = await User.find({ role: 'organization' }, 'name orgName orgType orgCategory address contact peopleServed');
    res.json(orgs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
