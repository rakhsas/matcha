import save from './insertData.js';
import { deleteByEmail, deleteById, deleteByUserName, deleteAll } from './deleteField.js';
import createTable from './createTables.js';
import * as constraints from './constraints/index.js';
import { findAll, findById, findOne, findOneByCondition, count  } from './findData.js';
import { update, updateOrInsert } from './updateData.js';
export default {
  save,
  deleteByEmail,
  deleteById,
  deleteByUserName,
  deleteAll,
  createTable,
  findAll,
  findById,
  findOne,
  findOneByCondition,
  update,
  updateOrInsert,
  count,
  constraints,
};
