const cors = require('cors');
const express = require('express');
const app = express();
const dbConfig = require('./db');
const eventroute = require('./routes/eventroute');
const userroute = require('./routes/userroute');
const bookingsroute = require('./routes/bookingroute'); // ✅ Correction ici
const searchroute = require('./routes/searchroute');

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

app.use('/api/event', eventroute);
app.use('/api/user', userroute);
app.use('/api/booking', bookingsroute); // ✅ Correction ici
app.use('/api/event/search', searchroute);

app.use('/uploads', express.static('uploads'));


const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on chosen port ${port}`);
});

const mongoose = require('mongoose');

mongoose.connection.once('open', async () => {
    console.log("✅ Connexion réussie à la base de données !");
    console.log("🗄️ Nom de la base de données utilisée :", mongoose.connection.name);
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("📂 Collections trouvées :", collections.map(col => col.name));
});
