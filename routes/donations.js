const express = require('express');
const Donation = require('../models/Donation');
const auth = require('../middleware/auth');
const router = express.Router();

// POST /api/donations  -> donor posts a new donation
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'donor') {
      return res.status(403).json({ message: 'Only donors can post donations' });
    }

    const { foodItem, quantity, expiryTime, location } = req.body;
    if (!foodItem || !quantity || !expiryTime || !location) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const donation = await Donation.create({
      foodItem, quantity, expiryTime, location,
      donor: req.user.id
    });

    res.status(201).json(donation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/donations  -> donor sees own list, NGO sees all Available ones
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role === 'donor') {
      const mine = await Donation.find({ donor: req.user.id }).sort('-createdAt');
      return res.json(mine);
    }
    const available = await Donation.find({ status: 'Available' })
      .populate('donor', 'name location')
      .sort('-createdAt');
    res.json(available);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/donations/:id/claim  -> NGO claims an available donation
router.put('/:id/claim', auth, async (req, res) => {
  try {
    if (req.user.role !== 'ngo') {
      return res.status(403).json({ message: 'Only NGOs can claim donations' });
    }

    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status: 'Claimed', claimedBy: req.user.id },
      { new: true }
    );
    if (!donation) return res.status(404).json({ message: 'Donation not found' });

    res.json(donation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/donations/:id/status  -> donor marks their donation as Picked Up
router.put('/:id/status', auth, async (req, res) => {
  try {
    const donation = await Donation.findOne({ _id: req.params.id, donor: req.user.id });
    if (!donation) return res.status(404).json({ message: 'Donation not found' });

    donation.status = req.body.status || 'Picked Up';
    await donation.save();

    res.json(donation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/donations/:id  -> donor deletes their own donation
router.delete('/:id', auth, async (req, res) => {
  try {
    const donation = await Donation.findOneAndDelete({
      _id: req.params.id,
      donor: req.user.id
    });
    if (!donation) return res.status(404).json({ message: 'Donation not found' });

    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
