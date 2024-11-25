var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createModel } from "../../../shared/models/entity";
const columns = {
    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
    firstName: 'VARCHAR(100) NOT NULL',
    lastName: 'VARCHAR(100) NOT NULL',
    email: 'VARCHAR(100) NOT NULL UNIQUE',
    username: 'VARCHAR(100) NOT NULL UNIQUE',
    password: 'VARCHAR(100) NOT NULL',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    rtoken: 'VARCHAR(100) DEFAULT NULL',
};
let userModel = null;
(() => __awaiter(void 0, void 0, void 0, function* () {
    userModel = createModel({ tableName: 'users', columns, foreignKey: [] });
    userModel.syncTable();
}))();
