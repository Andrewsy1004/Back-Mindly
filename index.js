import Express from 'express';
import cors from 'cors';

import 'dotenv/config';

import {dbConnection} from './database/config.js';
import UsuarioRoute from './routes/usuario.route.js';


const corsOptions = {
    origin: '*',
    credentials: true,
};

// Server
const app = Express();
const PORT = process.env.PORT || 3010;

dbConnection();

// Middlewares
app.use(Express.json());
app.use(Express.urlencoded({ extended: false }));
app.use(cors(corsOptions));

// Routes
app.use('/api/usuarios', UsuarioRoute);


app.get('/', (req, res) => {
    res.send('Hola desde el backend de Mindly !! ');
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});


