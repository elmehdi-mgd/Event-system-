const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true }, // Format ISO
  location: { type: String, required: true },
  availableSeats: { type: Number, required: true }, // Nom corrigé
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  images: [{ type: String }], // Nom corrigé
  Price : { type: Number ,required: true,
    min: 0,
    default: 0 },
});

const Event = mongoose.model('event', eventSchema, 'event');
// Middleware pour générer automatiquement le slug
// models/event.js
eventSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.nameSlug = this.name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

module.exports = Event;