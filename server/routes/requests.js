const router = require('express').Router();
const FoodRequest = require('../models/FoodRequest');
const { auth, requireRole } = require('../middleware/auth');

// Organization: create request
router.post('/', auth, requireRole('organization'), async (req, res) => {
  try {
    const { foodType, foodDescription, quantity, requiredDate } = req.body;
    const request = await FoodRequest.create({
      orgId: req.user.id, foodType, foodDescription, quantity, requiredDate,
    });
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all open requests (NGO/donor view)
router.get('/open', auth, async (req, res) => {
  try {
    const requests = await FoodRequest.find({ status: 'open' })
      .populate('orgId', 'name orgName orgType orgCategory address contact peopleServed')
      .sort('-createdAt');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Organization: get own requests
router.get('/my', auth, requireRole('organization'), async (req, res) => {
  try {
    const requests = await FoodRequest.find({ orgId: req.user.id })
      .populate('fulfilledBy')
      .sort('-createdAt');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// NGO: fulfill a request
router.patch('/:id/fulfill', auth, requireRole('ngo'), async (req, res) => {
  try {
    const request = await FoodRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Not found' });
    request.status = 'fulfilled';
    if (req.body.donationId) request.fulfilledBy = req.body.donationId;
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
