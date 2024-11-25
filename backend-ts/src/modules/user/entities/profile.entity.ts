import { createModel, createType, foreignKey } from "../../../shared/models/entity";

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
(async () => {
    createType({typeName: 'gender', values: ['M', 'F']});
    createType({typeName: 'sexualPreferences', values: ['M', 'F', 'B']});
    createType({typeName: 'interests', values: ['VEGAN', 'GEEK', 'PIERCING']});
    const foreignKey: foreignKey[] = [
        {
            column: 'id',
            refTable: 'users',
            refColumn: 'id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    ];
    userModel = createModel({ tableName: 'profile', columns, foreignKey })
    userModel.syncTable();
})();