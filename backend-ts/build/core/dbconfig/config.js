var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import pg from "pg";
const { Pool } = pg;
import 'dotenv/config';
import { logger } from "../logger/logger";
let config;
if (process.env.NODE_ENV === 'test') {
    config = require('../../tests/mockDatabase').default;
}
else {
    config = new Pool({
        user: process.env.POSTGRES_USER,
        host: process.env.POSTGRES_CONTAINER_NAME,
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
        port: Number(process.env.POSTGRES_PORT),
    });
}
const connectWithRetry = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (maxRetries = 5, delay = 2000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            yield config.connect();
            // console.log('Connected to the database successfully.');
            logger.log('Connected to the database successfully.');
            return;
        }
        catch (error) {
            console.error(`Attempt ${attempt} - Failed to connect to the database:`, error.message);
            if (attempt === maxRetries) {
                console.error('Max retries reached. Exiting application.');
                process.exit(1); // Exit the process with failure
            }
            console.error(`Waiting for ${delay / 1000}s before next retry...`);
            yield new Promise(res => setTimeout(res, delay));
            delay *= 2; // Exponential backoff
        }
    }
});
export { config, connectWithRetry };
