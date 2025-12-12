const House = require('../models/House');
const Request = require('../models/Request');
const User = require('../models/User');
const mongoose = require('mongoose');

// create house
exports.createHouse = async (req, res, next) => {
  try {
    const ownerId = req.user._id;
    const { title, cost, description, location, furnishing, isAvailable } = req.body;
    const photos = (req.files || []).map(f => `/uploads/${f.filename}`);

    const house = new House({
      ownerId, title, photos, cost, description, location, furnishing,
      isAvailable: isAvailable === 'false' ? false : true
    });

    await house.save();
    res.status(201).json({ message: 'House posted', house });
  } catch (err) { next(err); }
};

// get my houses
exports.getMyHouses = async (req, res, next) => {
  try {
    const ownerId = req.user._id;
    const houses = await House.find({ ownerId }).populate('acceptedUser', 'name email');
    res.json({ houses });
  } catch (err) { next(err); }
};

// update house
exports.updateHouse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ownerId = req.user._id;
    const house = await House.findById(id);
    if (!house) return res.status(404).json({ message: 'Not found' });
    if (!house.ownerId.equals(ownerId)) return res.status(403).json({ message: 'Forbidden' });

    // update fields
    const updates = (({ title, cost, description, location, furnishing, isAvailable }) => ({ title, cost, description, location, furnishing, isAvailable }))(req.body);
    Object.keys(updates).forEach(k => {
      if (updates[k] !== undefined) house[k] = updates[k];
    });

    if (req.files && req.files.length) {
      const photos = req.files.map(f => `/uploads/${f.filename}`);
      house.photos = house.photos.concat(photos);
    }

    await house.save();
    res.json({ message: 'Updated', house });
  } catch (err) { next(err); }
};

// get single house
exports.getSingleHouse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const house = await House.findById(id).populate('ownerId', 'name email').populate('requests', 'name email');
    if (!house) return res.status(404).json({ message: 'House not found' });
    res.json({ house });
  } catch (err) { next(err); }
};

// delete house
exports.deleteHouse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ownerId = req.user._id;
    const house = await House.findById(id);
    if (!house) return res.status(404).json({ message: 'Not found' });
    if (!house.ownerId.equals(ownerId)) return res.status(403).json({ message: 'Forbidden' });

    await Request.updateMany({ houseId: house._id, status: 'pending' }, { status: 'withdrawn' }); // optional cleanup
    await House.deleteOne({ _id: id });
    res.json({ message: 'House deleted' });
  } catch (err) { next(err); }
};

// get requests for a house (detailed)
exports.getRequests = async (req, res, next) => {
  try {
    const { houseId } = req.params;
    const ownerId = req.user._id;
    const house = await House.findById(houseId);
    if (!house) return res.status(404).json({ message: 'Not found' });
    if (!house.ownerId.equals(ownerId)) return res.status(403).json({ message: 'Forbidden' });

    const requests = await Request.find({ houseId }).populate('userId', 'name email');
    res.json({ requests });
  } catch (err) { next(err); }
};

// accept request
exports.acceptRequest = async (req, res, next) => {
  try {
    const { houseId, userId } = req.body;
    if (!houseId || !userId) return res.status(400).json({ message: 'houseId and userId required' });

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const house = await House.findById(houseId).session(session);
      if (!house) throw { status: 404, message: 'House not found' };
      if (!house.ownerId.equals(req.user._id)) throw { status: 403, message: 'Not owner' };
      if (!house.isAvailable) throw { status: 400, message: 'House not available' };

      // set acceptedUser, mark not available
      house.acceptedUser = userId;
      house.isAvailable = false;
      await house.save({ session });

      // update request
      const reqDoc = await Request.findOneAndUpdate({ houseId, userId }, { status: 'accepted' }, { new: true, session });
      if (!reqDoc) {
        // create if not exists
        await Request.create([{ userId, houseId, status: 'accepted' }], { session });
      }

      // set user's bookedHouse and clear selectedHouse
      await User.findByIdAndUpdate(userId, { bookedHouse: houseId, selectedHouse: null }, { session });

      // set other pending requests for this house to rejected
      await Request.updateMany({ houseId, status: 'pending', userId: { $ne: userId } }, { status: 'rejected' }, { session });

      await session.commitTransaction();
      session.endSession();

      res.json({ message: 'Accepted booking', house: { _id: houseId }, user: { _id: userId } });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  } catch (err) {
    if (err.status) return res.status(err.status).json({ message: err.message });
    next(err);
  }
};

// reject request
exports.rejectRequest = async (req, res, next) => {
  try {
    const { houseId, userId } = req.body;
    if (!houseId || !userId) return res.status(400).json({ message: 'houseId and userId required' });

    const house = await House.findById(houseId);
    if (!house) return res.status(404).json({ message: 'House not found' });
    if (!house.ownerId.equals(req.user._id)) return res.status(403).json({ message: 'Not owner' });

    await Request.findOneAndUpdate({ houseId, userId }, { status: 'rejected' }, { upsert: true });
    // remove userId from house.requests if exists
    house.requests = house.requests.filter(r => !r.equals(userId));
    await house.save();

    // optionally set user's selectedHouse to null if they had it
    await User.findByIdAndUpdate(userId, { selectedHouse: null });

    res.json({ message: 'Rejected booking', houseId, userId });
  } catch (err) { next(err); }
};
