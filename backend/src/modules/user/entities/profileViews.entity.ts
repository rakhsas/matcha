import { createModel, createType, foreignKey } from "../../../shared/models/entity";

const columns = {
    id: 'SERIAL PRIMARY KEY',
    viewerId: 'UUID NOT NULL',
    viewedProfileId: 'UUID NOT NULL',
    viewedAt: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
};



let model = null;
(async () => {
    const foreignKey: foreignKey[] = [
        {
            column: 'viewerId',
            refTable: 'users',
            refColumn: 'id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        {
            column: 'viewedProfileId',
            refTable: 'users',
            refColumn: 'id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    ];
    model = createModel({ tableName: 'profileViews', columns, foreignKey })
    // console.log(model.createTableQuery());
    model.syncTable();
})();