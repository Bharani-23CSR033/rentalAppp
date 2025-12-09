const House = require('../models/House');
const Request = require('../models/Request');
const User = require('../models/User');

exports.getAvailableHouses = async (req, res, next) => {
  try {
    const houses = await House.find({ isAvailable: true }).populate('ownerId', 'name email');
    res.json({ houses });
  } catch (err) { next(err); }
};

exports.createRequest = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { houseId } = req.body;
    if (!houseId) return res.status(400).json({ message: 'houseId required' });

    const house = await House.findById(houseId);
    if (!house) return res.status(404).json({ message: 'House not found' });
    if (!house.isAvailable) return res.status(400).json({ message: 'House not available' });

    // check if user already has a pending/accepted booking
    const user = await User.findById(userId);
    if (user.bookedHouse) return res.status(400).json({ message: 'You already have a booked house' });

    // create request if none exists
    let reqDoc = await Request.findOne({ houseId, userId });
    if (reqDoc && reqDoc.status === 'pending') return res.status(400).json({ message: 'Already requested' });

    if (!reqDoc) {
      reqDoc = new Request({ houseId, userId, status: 'pending' });
      await reqDoc.save();
    } else {
      reqDoc.status = 'pending';
      await reqDoc.save();
    }

    // add user to house.requests if not present
    if (!house.requests.some(r => r.equals(userId))) {
      house.requests.push(userId);
      await house.save();
    }

    // set user's selectedHouse
    user.selectedHouse = houseId;
    await user.save();

    res.json({ message: 'Request created', request: reqDoc });
  } catch (err) { next(err); }
};

exports.withdrawRequest = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { houseId } = req.params;

    const reqRec = await Request.findOne({ houseId, userId });
    if (!reqRec) return res.status(404).json({ message: 'Request not found' });

    // if already accepted cannot withdraw
    if (reqRec.status === 'accepted') return res.status(400).json({ message: 'Already accepted, cannot withdraw' });

    reqRec.status = 'withdrawn';
    await reqRec.save();

    // remove from house.requests
    const house = await House.findById(houseId);
    if (house) {
      house.requests = house.requests.filter(r => !r.equals(userId));
      await house.save();
    }

    // clear user's selectedHouse
    await User.findByIdAndUpdate(userId, { selectedHouse: null });

    res.json({ message: 'Request withdrawn' });
  } catch (err) { next(err); }
};

exports.getMyHouse = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate({ path: 'bookedHouse', populate: { path: 'ownerId', select: 'name email' }});
    res.json({ bookedHouse: user.bookedHouse || null });
  } catch (err) { next(err); }
};

exports.getRejected = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const requests = await Request.find({ userId, status: 'rejected' }).populate('houseId');
    res.json({ rejected: requests });
  } catch (err) { next(err); }
};
