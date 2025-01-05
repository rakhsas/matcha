import { createModel, foreignKey } from "../../../shared/models/entity";

const columns = {
    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
    firstName: 'VARCHAR(100) NOT NULL',
    lastName: 'VARCHAR(100) NOT NULL',
    email: 'VARCHAR(100) NOT NULL UNIQUE',
    username: 'VARCHAR(100) NOT NULL UNIQUE',
    password: 'VARCHAR(100) NOT NULL',
    rtoken: 'VARCHAR(100) DEFAULT NULL',
    verified: 'BOOLEAN DEFAULT FALSE',
    vtoken: 'VARCHAR(100) DEFAULT NULL',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
};

let userModel = null;
(async () => {
    
    userModel = createModel({ tableName: 'users', columns, foreignKey: [] });
    userModel.syncTable();
})();