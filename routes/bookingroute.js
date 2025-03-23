const express = require('express');
const router = express.Router();
const Bookingmodel = require('../models/booking');
// 📌 Route pour réserver un événement
router.post('/bookevent', async (req, res) => {
    const { event, user, userid, nbrpersonne } = req.body;

    if (!event || !event.name || !event._id || !user || !userid || !nbrpersonne) {
        return res.status(400).json({ message: "Données invalides" });
    }

    try {
        const newbooking = new Bookingmodel({ 
            event: event.name,
            eventid: event._id,
            user: user.name,
            userid,
            nbrpersonne,
            bookingdate: new Date(),
            prixtotale: event.Price * nbrpersonne,
            transactionid: '1234'
        });

        const savedBooking = await newbooking.save();
        res.status(201).json(savedBooking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 📌 Route pour récupérer les réservations d'un utilisateur
router.post('/getbookingsbyusername', async (req, res) => {
    const { username } = req.body;
    
    if (!username) {
        return res.status(400).json({ message: 'Nom d’utilisateur requis' });
    }

    try {
        const bookings = await Bookingmodel.find({ user: username });
        if (bookings.length > 0) {
            res.status(200).json(bookings);
        } else {
            res.status(404).json({ message: 'Aucune réservation trouvée' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});
router.delete('/cancelbooking/:id', async (req, res) => {
    try {
        // Validation de l'ID
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Format ID invalide' });
        }

        // Mise à jour du statut
        const booking = await Bookingmodel.findByIdAndUpdate(
            req.params._id,
            { status: 'Annulé' },
            { new: true, runValidators: true }
        );

        if (!booking) {
            return res.status(404).json({ error: 'Réservation introuvable' });
        }

        res.json({ 
            message: 'Annulation réussie',
            booking: {
                ...booking._doc,
                bookingdate: booking.bookingdate.toLocaleString()
            }
        });

    } catch (error) {
        const response = {
            error: 'Erreur technique',
            code: error.name
        };

        if (error.name === 'ValidationError') {
            response.details = error.errors.status?.message;
        }

        if (process.env.NODE_ENV === 'development') {
            response.stack = error.stack;
        }

        res.status(500).json(response);
    }
});

router.get('/getallbookings', async (req, res) => {
    try {
        const bookings = await Bookingmodel.find();
        res.status(200).json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});
  


  
module.exports = router;
