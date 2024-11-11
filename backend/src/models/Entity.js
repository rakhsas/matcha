
import pool from "../config/database.js";

export const createModel = ({ tableName, columns }) => {
    return {
        tableName,
        columns,
        createTableQuery() {
            const columnsDefinition = Object.entries(this.columns)
                .map(([column, type]) => `${column} ${type}`)
                .join(', ');
            return `CREATE TABLE IF NOT EXISTS ${this.tableName} (${columnsDefinition})`;
        },
        async syncTable() {
            await pool.query(this.createTableQuery());

            const existingColumnsResult = await pool.query(`
                SELECT column_name, is_nullable, column_default, is_identity, 
                       EXISTS (
                           SELECT constraint_type
                           FROM information_schema.table_constraints AS tc
                           JOIN information_schema.constraint_column_usage AS ccu 
                           ON tc.constraint_name = ccu.constraint_name
                           WHERE tc.table_name = $1 
                           AND tc.constraint_type = 'PRIMARY KEY'
                           AND ccu.column_name = column_name
                       ) AS is_primary
                FROM information_schema.columns
                WHERE table_name = $1
            `, [this.tableName]);

            const existingColumns = existingColumnsResult.rows.reduce((acc, row) => {
                acc[row.column_name.toLowerCase()] = {
                    is_nullable: row.is_nullable === 'YES',
                    default: row.column_default,
                    is_identity: row.is_identity === 'YES',
                    is_primary: row.is_primary
                };
                return acc;
            }, {});

            const modelColumns = Object.keys(this.columns).map(col => col.toLowerCase());
            const missingColumns = modelColumns.filter(column => !existingColumns[column]);
            const extraColumns = Object.keys(existingColumns).filter(column => !modelColumns.includes(column));

            for (const [column, type] of Object.entries(this.columns).filter(([col]) => missingColumns.includes(col.toLowerCase()))) {
                const alterQuery = `ALTER TABLE ${this.tableName} ADD COLUMN ${column} ${type}`;
                await pool.query(alterQuery);
                console.log(`Added column ${column} to ${this.tableName}`);
            }

            for (const column of extraColumns) {
                if (!existingColumns[column].is_identity && !existingColumns[column].is_primary) {
                    const dropQuery = `ALTER TABLE ${this.tableName} DROP COLUMN ${column}`;
                    await pool.query(dropQuery);
                    console.log(`Dropped column ${column} from ${this.tableName}`);
                }
            }

            for (const [column, type] of Object.entries(this.columns)) {
                const existingColumn = existingColumns[column.toLowerCase()];

                if (!existingColumn) continue;

                if (!existingColumn.is_identity && !existingColumn.is_primary) {
                    const nullable = !type.toUpperCase().includes('NOT NULL');
                    const columnDefault = type.match(/DEFAULT ([^ ]+)/i)?.[1];

                    if (nullable !== existingColumn.is_nullable) {
                        const alterNullQuery = `ALTER TABLE ${this.tableName} ALTER COLUMN ${column} ${nullable ? 'DROP NOT NULL' : 'SET NOT NULL'}`;
                        await pool.query(alterNullQuery);
                        console.log(`Updated nullability of ${column} to ${nullable ? 'nullable' : 'not nullable'}`);
                    }

                    if (columnDefault && columnDefault !== existingColumn.default) {
                        const alterDefaultQuery = `ALTER TABLE ${this.tableName} ALTER COLUMN ${column} SET DEFAULT ${columnDefault}`;
                        await pool.query(alterDefaultQuery);
                        console.log(`Updated default value of ${column} to ${columnDefault}`);
                    } else if (!columnDefault && existingColumn.default) {
                        const dropDefaultQuery = `ALTER TABLE ${this.tableName} ALTER COLUMN ${column} DROP DEFAULT`;
                        await pool.query(dropDefaultQuery);
                        console.log(`Dropped default value of ${column}`);
                    }
                }
            }
        }
    };
};
