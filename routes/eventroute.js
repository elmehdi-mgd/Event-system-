const express = require('express');
const router = express.Router();
const Event = require('../models/event'); // Assurez-vous que le chemin est correct
const mongoose = require('mongoose');
const multer = require('multer');
// Route pour récupérer tous les événements
router.get("/getallevent", async (req, res) => {
    try {
        console.log("Tentative de récupération des événements...");

        const events = await Event.find();
        console.log("Nombre d'événements trouvés :", events.length);
console.log("Données récupérées :", events);

        console.log("📢 Résultat brut :", events);

        if (events.length === 0) {
            console.log("⚠️ Aucun événement trouvé !");
            return res.status(200).json({ message: "Aucun événement trouvé", events: [] });
        }

        return res.status(200).json({ message: "Événements récupérés avec succès", events });
    } catch (error) {
        console.error("❌ Erreur lors de la récupération :", error);
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
});





router.get('/:identifier', async (req, res) => {
  try {
    const rawIdentifier = decodeURIComponent(req.params.identifier)
      .replace(/-/g, ' ')
      .replace(/%20/g, ' ')
      .trim();

    // Correction ici : Supprimer $options et garder seulement $regex
    const event = await Event.findOne({
      name: { 
        $regex: new RegExp(`^${rawIdentifier}$`, 'i') 
      }
    }).collation({ locale: 'fr', strength: 1 });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Événement non trouvé"
      });
    }

    res.json(event);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Configuration de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Route POST modifiée
router.post('/addevent', upload.array('images'), async (req, res) => {
  try {
    const { name, description, date, location, availableSeats, price } = req.body;
    
    if (!name || !description || !date || !location || !availableSeats || !price) {
      return res.status(400).json({ message: "Données manquantes" });
    }

    const images = req.files.map(file => file.path);

    const newEvent = new Event({
      name,
      description,
      date: new Date(date),
      location,
      availableSeats: parseInt(availableSeats),
      price: parseFloat(price),
      images
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});
module.exports = router;

