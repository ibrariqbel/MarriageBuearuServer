const { messageHandler } = require("../utils/messageHandler");

// Generic function to CREATE a new lookup item
const createLookup = (Model) => async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return messageHandler(res, 400, "Name is required");
    }
    const exists = await Model.findOne({ name });
    if (exists) {
      return messageHandler(res, 400, "This name already exists");
    }
    const newItem = await Model.create({ name, description });
    return messageHandler(res, 201, "Created successfully", newItem);
  } catch (error) {
    return messageHandler(res, 500, `Server Error: ${error.message}`);
  }
};

// Generic function to GET ALL lookup items
const getAllLookups = (Model) => async (req, res) => {
  try {
    const items = await Model.find();
    return messageHandler(res, 200, `${items.length} items found`, items);
  } catch (error) {
    return messageHandler(res, 500, `Server Error: ${error.message}`);
  }
};

// Generic function to UPDATE a lookup item
const updateLookup = (Model) => async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    const item = await Model.findById(id);
    if (!item) {
      return messageHandler(res, 404, "Item not found");
    }

    item.name = name || item.name;
    item.description = description || item.description;
    await item.save();
    
    return messageHandler(res, 200, "Updated successfully", item);
  } catch (error) {
    return messageHandler(res, 500, `Server Error: ${error.message}`);
  }
};

// Generic function to DELETE a lookup item
const deleteLookup = (Model) => async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Model.findById(id);
    if (!item) {
      return messageHandler(res, 404, "Item not found");
    }
    await item.remove();
    return messageHandler(res, 200, "Deleted successfully");
  } catch (error) {
    return messageHandler(res, 500, `Server Error: ${error.message}`);
  }
};

module.exports = {
  createLookup,
  getAllLookups,
  updateLookup,
  deleteLookup,
};