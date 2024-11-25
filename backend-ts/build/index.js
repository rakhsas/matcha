var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import 'reflect-metadata'; // Required for decorators if you are using them
import { AppModule } from './app.module'; // Import the root application module
import { logger } from './core/logger/logger';
import { connectWithRetry } from './core/dbconfig/config';
import './core/logger/file-watcher';
const __dirname = path.dirname(new URL(import.meta.url).pathname);
import loadEntities from './core/dbconfig/load';
import path from 'path';
import express from 'express';
import routes from './shared/routes';
import dotenv from 'dotenv';
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const app = express();
            app.use(express.json());
            dotenv.config();
            logger.log('Starting application...');
            // Initialize the root application module
            try {
                const appModule = new AppModule();
            }
            catch (err) {
                throw new Error(`Failed to initialize application module: ${err.message}`);
            }
            // Set up routes
            try {
                routes(app);
            }
            catch (err) {
                throw new Error(`Failed to load entities: ${err.message}`);
            }
            // Establish the database connection with retries
            try {
                yield connectWithRetry();
            }
            catch (err) {
                throw new Error(`Database connection failed: ${err.message}`);
            }
            // Load entities
            try {
                loadEntities(__dirname);
            }
            catch (err) {
                throw new Error(`Failed to load entities: ${err.message}`);
            }
            // Start the server and listen on a specific port
            const port = process.env.PORT || 3000;
            app.listen(port, () => {
                logger.log(`Server is running on port ${port}`);
            });
            logger.log('Application initialized successfully!');
        }
        catch (error) {
            logger.error({
                message: 'Failed to start the application',
                errorName: error.name,
                errorMessage: error.message,
                stack: error.stack,
            });
            process.exit(1); // Exit the process in case of a critical error
        }
    });
}
bootstrap();
