import express from 'express';
import http from 'http';
import fs from 'fs';
import { join } from 'path';
import { app } from 'electron';
import cors from 'cors';

const expressApp = express();
const pdfFolder = join(app.getPath('appData'), 'Docmaen');
const serverPort = 3500;
const serverHost = 'localhost';
const serverUrl = `http://${serverHost}:${serverPort}`;
expressApp.use(cors({
  origin: 'http://localhost:3000', // El origen de tu aplicación Electron
  methods: ['GET'], // Solo permitir solicitudes GET
  optionsSuccessStatus: 200 // Para navegadores antiguos (IE11, etc)
}));

// Función para iniciar el servidor
function startServer(port = serverPort) {
    return new Promise((resolve) => {
        const server = http.createServer(expressApp);
        server.listen(port, () => {
            resolve(server);
        });
    });
}

function getServer() { return serverUrl}

// Servir PDFs
expressApp.get('/pdf/:type/:user/:name', (req, res) => {
    const { type, user, name } = req.params;
    const pdfPath = join(pdfFolder, type, user, `${name}.pdf`);

    if (fs.existsSync(pdfPath)) res.sendFile(pdfPath);
    else res.status(404).send('PDF no encontrado');
});

const functions = {
  startServer,
  getServer,
};

export default functions;