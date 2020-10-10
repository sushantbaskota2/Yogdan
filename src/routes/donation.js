const Donation = require('../models/donations');
const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');

router.get('/:id', auth, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate({
        path: 'cause',
        select: 'title images',
      })
      .select('-user');

    if (!donation) {
      return res.status(400).send({
        errMessage: 'No such donation found',
      });
    }
    res.send(donation);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
