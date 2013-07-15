var MemoryStore, Super, modelUtils, _;

_ = require('underscore');
Super = MemoryStore = require('./memory_store');
modelUtils = require('../modelUtils');

module.exports = ModelStore;

function ModelStore() {
  Super.apply(this, arguments);
}

/**
 * Set up inheritance.
 */
ModelStore.prototype = Object.create(Super.prototype);
ModelStore.prototype.constructor = ModelStore;

ModelStore.prototype.set = function(model) {
  var existingModel, id, key, modelName, newAttrs;

  id = model.get(model.idAttribute);
  modelName = modelUtils.modelName(model.constructor);
  if (modelName == null) {
    throw new Error('Undefined modelName for model');
  }
  key = getModelStoreKey(modelName, id);

  /*
  * If the model is already present in the store set the existing model attrs with the newer model's data
  * present in the store.
  */
  existingModel = this.get(modelName, id);
  if (existingModel == model) {
    // already in store
    return true;
  }
  else if (existingModel) {
    // update existing model with new data
    existingModel.set(model.toJSON());
    return true;
  }
  else {
    // new model in store
    return Super.prototype.set.call(this, key, model, null);
  }
};

ModelStore.prototype.get = function(modelName, id) {
  var key;
  key = getModelStoreKey(modelName, id);
  return Super.prototype.get.call(this, key);
};

ModelStore.prototype._formatKey = function(key) {
  return Super.prototype._formatKey.call(this, "_ms:" + key);
};

function getModelStoreKey(modelName, id) {
  var underscored = modelUtils.underscorize(modelName);
  return underscored + ":" + id;
}
