import fs from 'fs';
import { dirname } from 'path';

async function loadEntities(__dirname: string) {
    const files = fs.readdirSync(__dirname);
    for (const file of files) {
        // check if file is a directory
        const isDirectory = fs.lstatSync(`${__dirname}/${file}`).isDirectory();
        if (isDirectory) {
            await loadEntities(`${__dirname}/${file}`);
        } else {
            if (file.endsWith('.entity.ts')) {
                const entity = await import(`${__dirname}/${file}`);
            }
        }
    }
}

export default loadEntities;