//firebase-server.js
const express = require('express');
const cors = require('cors'); // Importa CORS
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const { getFirestore } = require('firebase-admin/firestore'); // Importar Firestore

// Inicializa Firebase Admin
const serviceAccount = require('../config/hormonavida-firebase-adminsdk.json'); // Ruta al archivo JSON

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const app = express();

app.use(cors()); // Habilitar CORS
app.use(bodyParser.json());

// Endpoint para enviar notificaciones
app.post('/send-notification', async (req, res) => {
  const { userId, title, body } = req.body; // userId es el ID del documento en Firestore
  const firestore = getFirestore();

  try {
    // Buscar el token en Firestore
    const userTokenDoc = await firestore.collection('userTokens').doc(userId).get();
    if (!userTokenDoc.exists) {
      return res.status(404).send({ success: false, error: 'Token de usuario no encontrado' });
    }

    const registrationToken = userTokenDoc.data().token;
    if (!registrationToken) {
      return res.status(400).send({ success: false, error: 'Token vacío o no válido' });
    }

    const message = {
      notification: {
        title,
        body,
      },
      token: registrationToken,
    };

    // Enviar notificación
    const response = await admin.messaging().send(message);
    console.log('Notificación enviada:', response);
    res.status(200).send({ success: true, message: 'Notificación enviada correctamente' });
  } catch (error) {
    console.error('Error al enviar la notificación:', error);
    res.status(500).send({ success: false, error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});
