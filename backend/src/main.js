import express from 'express';
import 'dotenv/config'
import loadEntities from './config/loadEntitites.js';
const app = express();
import routes from './shared/routes/index.js';

loadEntities()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
