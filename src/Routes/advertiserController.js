const express = require('express');
const router = express.Router();

const advertiserModel = require('../Models/Advertiser.js');
const Activity = require('../Models/Activity.js');

const createProfile = async (req, res) => {
    const { email, username, password, company_name, website, hotline, companyDescription } = req.body;

    try {
        const profile = await advertiserModel.create({
            email,
            username,
            password,
            company_name,
            website,
            hotline,
            companyDescription
        });
        res.status(201).json(profile);
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(400).json({ error: err.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const profiles = await advertiserModel.find();
        res.status(200).json(profiles);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const updateProfile = async (req, res) => {
    const { id } = req.params;
    const { company_name, website, hotline, companyDescription } = req.body;
    try {
        const profile = await advertiserModel.findByIdAndUpdate(id, { company_name, website, hotline, companyDescription }, { new: true });
        
        if (!profile) {
            return res.status(404).json({ error: "Profile not found" });
        }

        res.status(200).json(profile);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const deleteProfile = async (req, res) => {
    const { id } = req.params;
    try {
        const profile = await advertiserModel.findByIdAndDelete(id);

        if (!profile) {
            return res.status(404).json({ error: "Profile not found" });
        }

        res.status(204).send();
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Requirement 19 additions

const createActivity = async (req, res) => {
    const {
        date,
        time,
        location,
        price,
        category,
        specialDiscount,
        bookingOpen,
        tags
    } = req.body;

    try {
        const activity = await Activity.create({
            date,
            time,
            location,
            price,
            category,
            specialDiscount,
            bookingOpen,
            tags
        });
        res.status(201).json(activity);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const getActivities = async (req, res) => {
    try {
        const activities = await Activity.find();
        res.status(200).json(activities);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const viewCreatedActivities = async (req, res) => {
    try {
        const activities = await Activity.find();
        res.render('activities', { activities });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const updateActivity = async (req, res) => {
    const { id } = req.params;
    const trimmedId = id.trim();
    const {
        date,
        time,
        location,
        price,
        category,
        specialDiscount,
        bookingOpen,
        tags
    } = req.body;

    try {
        const activity = await Activity.findByIdAndUpdate(
            trimmedId,
            {
                date,
                time,
                location,
                price,
                category,
                specialDiscount,
                bookingOpen,
                tags
            },
            { new: true }
        );

        if (!activity) {
            return res.status(404).json({ error: "Activity not found" });
        }

        res.status(200).json(activity);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const deleteActivity = async (req, res) => {
    const { id } = req.params;
    try {
        const activity = await Activity.findByIdAndDelete(id);

        if (!activity) {
            return res.status(404).json({ error: "Activity not found" });
        }

        res.status(204).send();
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

router.post('/addprofiles', createProfile);
router.get('/profiles', getProfile);
router.put('/updateprofiles/:id', updateProfile);
router.delete('/deleteprofiles/:id', deleteProfile);

router.post('/addactivity', createActivity);
router.get('/getactivity', getActivities);
router.put('/updateactivity/:id', updateActivity);
router.delete('/deleteactivity/:id', deleteActivity);
router.get('/viewactivity', viewCreatedActivities);

module.exports = router; // Export the router directly

