const createTable = async (model) => {
    try {
        console.log(model)
        await model.syncTable()
        console.log(`Table ${model.tableName} table created or already exists`);
        return true;
    } catch (error) {
        console.error(`Error creating ${model.tableName} table`, error);
        return false;
    }
}

const create = async (model) => {
    console.log(model)
    return await createTable(model)
}


export default create;