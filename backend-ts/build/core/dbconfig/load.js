var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from 'fs';
function loadEntities(__dirname) {
    return __awaiter(this, void 0, void 0, function* () {
        const files = fs.readdirSync(__dirname);
        for (const file of files) {
            // check if file is a directory
            const isDirectory = fs.lstatSync(`${__dirname}/${file}`).isDirectory();
            if (isDirectory) {
                yield loadEntities(`${__dirname}/${file}`);
            }
            else {
                if (file.endsWith('.entity.ts')) {
                    const entity = yield import(`${__dirname}/${file}`);
                }
            }
        }
    });
}
export default loadEntities;
