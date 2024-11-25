var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createModel, createType } from "../../../shared/models/entity";
const columns = {
    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
    gender: 'gender DEFAULT \'M\'',
    sexualPreferences: 'sexualPreferences DEFAULT \'B\'',
    bio: 'VarChar(255) DEFAULT NULL',
    interests: 'interests DEFAULT \'VEGAN\'',
    location: 'VarChar(255) DEFAULT NULL',
    pictures: 'VarChar(255)[] NOT NULL',
};
let userModel = null;
(() => __awaiter(void 0, void 0, void 0, function* () {
    createType({ typeName: 'gender', values: ['M', 'F'] });
    createType({ typeName: 'sexualPreferences', values: ['M', 'F', 'B'] });
    createType({ typeName: 'interests', values: ['VEGAN', 'GEEK', 'PIERCING'] });
    const foreignKey = [
        {
            column: 'id',
            refTable: 'users',
            refColumn: 'id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    ];
    userModel = createModel({ tableName: 'profile', columns, foreignKey });
    userModel.syncTable();
}))();
