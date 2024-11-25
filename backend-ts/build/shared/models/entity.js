var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { config as pool } from "../../core/dbconfig/config";
import { logger } from "../../core/logger/logger";
export const createType = (_a) => __awaiter(void 0, [_a], void 0, function* ({ typeName, values }) {
    const query = `
        DO $$ 
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = '${typeName}') THEN
                CREATE TYPE ${typeName} AS ENUM (${values.map(value => `'${value}'`).join(', ')});
            END IF;
        EXCEPTION
            WHEN duplicate_object THEN
                RAISE NOTICE 'type ${typeName} already exists';
        END $$;
    `;
    yield pool.query(query);
    logger.log(`Created type ${typeName}`);
});
export const createModel = ({ tableName, columns, foreignKey }) => {
    return {
        tableName,
        columns,
        createTableQuery() {
            const columnsDefinition = Object.entries(this.columns)
                .map(([column, type]) => `${column} ${type}`)
                .join(', ');
            const foreignKeys = foreignKey.map(fk => `FOREIGN KEY (${fk.column}) REFERENCES ${fk.refTable}(${fk.refColumn}) ON DELETE ${fk.onDelete} ON UPDATE ${fk.onUpdate}`).join(', ');
            return `CREATE TABLE IF NOT EXISTS ${this.tableName} (${columnsDefinition} ${foreignKeys.length > 1 ? ',' + foreignKeys : ''}) `;
        },
        syncTable() {
            return __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                yield pool.query(this.createTableQuery());
                const existingColumnsResult = yield pool.query(`
                    SELECT 
                        c.column_name,
                        c.is_nullable,
                        c.column_default,
                        c.is_identity,
                        EXISTS (
                            SELECT 1
                            FROM information_schema.table_constraints AS tc
                            JOIN information_schema.constraint_column_usage AS ccu
                            ON tc.constraint_name = ccu.constraint_name
                            WHERE tc.table_name = c.table_name
                            AND tc.constraint_type = 'PRIMARY KEY'
                            AND ccu.column_name = c.column_name
                        ) AS is_primary,
                        EXISTS (
                            SELECT 1
                            FROM information_schema.table_constraints AS tc
                            JOIN information_schema.constraint_column_usage AS ccu
                            ON tc.constraint_name = ccu.constraint_name
                            WHERE tc.table_name = c.table_name
                            AND tc.constraint_type = 'UNIQUE'
                            AND ccu.column_name = c.column_name
                        ) AS is_unique
                    FROM information_schema.columns AS c
                    WHERE c.table_name = $1;

            `, [this.tableName]);
                const existingColumns = existingColumnsResult.rows.reduce((acc, row) => {
                    acc[row.column_name.toLowerCase()] = {
                        is_nullable: row.is_nullable === 'YES',
                        default: row.column_default,
                        is_identity: row.is_identity === 'YES',
                        is_primary: row.is_primary,
                        is_unique: row.is_unique,
                        column_name: row.column_name
                    };
                    return acc;
                }, {});
                const modelColumns = Object.keys(this.columns).map(col => col.toLowerCase());
                const missingColumns = modelColumns.filter(column => !existingColumns[column]);
                const extraColumns = Object.keys(existingColumns).filter(column => !modelColumns.includes(column));
                for (const [column, type] of Object.entries(this.columns).filter(([col]) => missingColumns.includes(col.toLowerCase()))) {
                    const alterQuery = `ALTER TABLE ${this.tableName} ADD COLUMN ${column} ${type}`;
                    yield pool.query(alterQuery);
                    logger.log(`Added column ${column} to ${this.tableName}`);
                }
                for (const column of extraColumns) {
                    if (!existingColumns[column].is_identity && !existingColumns[column].is_primary) {
                        const dropQuery = `ALTER TABLE ${this.tableName} DROP COLUMN ${column}`;
                        yield pool.query(dropQuery);
                        logger.log(`Dropped column ${column} from ${this.tableName}`);
                    }
                }
                for (const [column, type] of Object.entries(this.columns)) {
                    const existingColumn = existingColumns[column.toLowerCase()];
                    if (!existingColumn)
                        continue;
                    if (!existingColumn.is_identity && !existingColumn.is_primary) {
                        const nullable = !type.toUpperCase().includes('NOT NULL');
                        const columnDefault = (_a = type.match(/DEFAULT ([^ ]+)/i)) === null || _a === void 0 ? void 0 : _a[1];
                        if (nullable !== existingColumn.is_nullable) {
                            const alterNullQuery = `ALTER TABLE ${this.tableName} ALTER COLUMN ${column} ${nullable ? 'DROP NOT NULL' : 'SET NOT NULL'}`;
                            yield pool.query(alterNullQuery);
                            logger.log(`Updated nullability of ${column} to ${nullable ? 'nullable' : 'not nullable'}`);
                        }
                        if (columnDefault && columnDefault !== ((_b = existingColumn.default) === null || _b === void 0 ? void 0 : _b.replace(/::[a-z ]+/, ''))) {
                            const alterDefaultQuery = `ALTER TABLE ${this.tableName} ALTER COLUMN ${column} SET DEFAULT ${columnDefault}`;
                            yield pool.query(alterDefaultQuery);
                            logger.log(`Updated default value of ${column} to ${columnDefault}`);
                        }
                        else if (!columnDefault && existingColumn.default) {
                            const dropDefaultQuery = `ALTER TABLE ${this.tableName} ALTER COLUMN ${column} DROP DEFAULT`;
                            yield pool.query(dropDefaultQuery);
                            logger.log(`Dropped default value of ${column}`);
                        }
                    }
                    if (type.toUpperCase().includes('UNIQUE') && !existingColumn.is_unique) {
                        const addUniqueQuery = `ALTER TABLE ${this.tableName} ADD CONSTRAINT ${tableName}_${column}_key UNIQUE (${column})`;
                        yield pool.query(addUniqueQuery);
                        logger.debug(`Added unique constraint to ${column}`);
                    }
                    else if (!type.toUpperCase().includes('UNIQUE') && existingColumn.is_unique) {
                        const dropUniqueQuery = `ALTER TABLE ${this.tableName} DROP CONSTRAINT ${tableName}_${column}_key`;
                        yield pool.query(dropUniqueQuery);
                        logger.debug(`Dropped unique constraint from ${column}`);
                    }
                }
            });
        }
    };
};
