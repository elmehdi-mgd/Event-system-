const express = require('express');
const router = express.Router();
const Event = require('../models/event'); 

router.get('search', async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ success: false, message: 'Aucune recherche spécifiée.' });
    }

    try {
        const events = await Event.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        });

        if (events.length === 0) {
            return res.status(404).json({ success: false, message: 'Aucun événement trouvé' });
        }

        res.json({ success: true, events });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
});
module.exports = router;