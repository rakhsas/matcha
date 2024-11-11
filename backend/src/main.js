import express from 'express';
import 'dotenv/config'
import loadEntities from './config/loadEntitites.js';
import repository from '../repository/index.js';
const app = express();
import routes from './shared/routes/index.js';
import authMiddleware from './shared/middleware/auth.middleware.js';
import { attachControllers } from '@decorators/express';
// import AuthController from './modules/auth/auth.controller.js';

// dotenv.config();
// async() => {
     loadEntities()
// }
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(authMiddleware)
routes(app);

// attachControllers(app, [AuthController])


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
