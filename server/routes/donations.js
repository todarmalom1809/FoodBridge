const router = require('express').Router();
const Donation = require('../models/Donation');
const { auth, requireRole } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// Donor: create donation
router.post('/', auth, requireRole('donor'), upload.single('photo'), async (req, res) => {
  try {
    const { foodName, quantity, description, pickupLocation, pickupTime, foodType } = req.body;
    const donation = await Donation.create({
      donorId: req.user.id,
      foodName, quantity, description, pickupLocation, pickupTime,
      foodType: foodType || 'human',
      photoUrl: req.file?.path || '',
    });
    res.status(201).json(donation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get available donations (NGO/org view) with optional foodType filter
router.get('/available', auth, async (req, res) => {
  try {
    const filter = { status: 'available' };
    if (req.query.foodType) filter.foodType = { $in: [req.query.foodType, 'both'] };
    const donations = await Donation.find(filter).populate('donorId', 'name address contact').sort('-createdAt');
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Donor: get own donations
router.get('/my', auth, requireRole('donor'), async (req, res) => {
  try {
    const donations = await Donation.find({ donorId: req.user.id })
      .populate('claimedBy', 'name ngoName contact')
      .populate('deliveredTo', 'name orgName')
      .sort('-createdAt');
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// NGO: get claimed donations
router.get('/claimed', auth, requireRole('ngo'), async (req, res) => {
  try {
    const donations = await Donation.find({ claimedBy: req.user.id })
      .populate('donorId', 'name address contact')
      .populate('deliveredTo', 'name orgName address contact')
      .sort('-createdAt');
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// NGO: claim a donation
router.patch('/:id/claim', auth, requireRole('ngo'), async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ message: 'Donation not found' });
    if (donation.status !== 'available') return res.status(400).json({ message: 'Donation not available' });
    donation.status = 'claimed';
    donation.claimedBy = req.user.id;
    await donation.save();
    res.json(donation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// NGO: update status (picked_up / distributed) with optional proof photo and deliveredTo
router.patch('/:id/status', auth, requireRole('ngo'), upload.single('proof'), async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ message: 'Not found' });
    if (String(donation.claimedBy) !== req.user.id) return res.status(403).json({ message: 'Not your donation' });

    const { status, deliveredTo } = req.body;
    if (!['picked_up', 'distributed'].includes(status))
      return res.status(400).json({ message: 'Invalid status' });

    donation.status = status;
    if (req.file?.path) donation.distributionProof = req.file.path;
    if (deliveredTo) donation.deliveredTo = deliveredTo;
    if (status === 'distributed') donation.completedAt = new Date();
    await donation.save();
    res.json(donation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
