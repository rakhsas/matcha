import fs from 'fs';
import path from "path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const entitiesDirectory = path.join(__dirname, '../entities');

async function loadEntities() {
    const files = fs.readdirSync(entitiesDirectory);

    const entityFiles = files.filter(file => file.endsWith('.js'));

    for (const file of entityFiles) {
        const filePath = path.join(entitiesDirectory, file);
        try {
            await import(filePath);
        } catch (error) {
            console.error('Error loading entity', error);
        }
    }
}

export default loadEntities;