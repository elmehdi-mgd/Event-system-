const mongoose = require('mongoose');
const moment = require('moment');

const bookingSchema = mongoose.Schema({
    event: {
        type: String,
        required: true
    },
    eventid: {
        type: String,
        required: true
    },
    userid: {
        type: String,
        required: true
    },
    user: {  // Nom correspondant à celui utilisé dans la route
        type: String,
        required: true
    },
    nbrpersonne: {
        type: Number,
        required: true
    },
    prixtotale: {
        type: Number,
        required: true
    },
    transactionid: {
        type: String,
        required: true
    },
    bookingdate: {
        type: Date,
        required: true,
        get: function (value) {
            return moment(value).format('DD-MM-YYYY HH:mm:ss');
        }
    },
    status: {
        type: String,
        required: true,
        default: 'Réservé',
        enum: ['Réservé', 'Annulé']
    }
}, {
    timestamps: true
});

bookingSchema.set('toJSON', { getters: true, virtuals: false });
bookingSchema.set('toObject', { getters: true, virtuals: false });

const Bookingmodel = mongoose.model('Booking', bookingSchema, 'bookings');

module.exports = Bookingmodel;
