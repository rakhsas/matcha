import { save } from "./save";
import { update, updateOrInsert } from "./update";
import { count, findAll, findById, findOne, findOneByCondition, findWithRelations } from "./find";
export const repository = {
    save,
    update,
    updateOrInsert,
    count,
    findAll,
    findById,
    findOne,
    findOneByCondition,
    findWithRelations
}