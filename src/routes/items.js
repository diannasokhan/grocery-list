const express = require("express");
const router = express.Router();

const itemController = require("../controllers/itemController");
const validation = require("./validation")

router.get("/lists/:listId/items/new", itemController.new);
router.post("/lists/:listId/items/create", validation.validateItems, itemController.create);
router.post("/lists/:listId/items/:id/destroy", itemController.destroy);
router.get("/lists/:listId/items/:id/edit", itemController.edit);
router.post("/lists/:listId/items/:id/update", validation.validateItems, itemController.update);
router.post("/lists/:listId/items/:id/purchased", itemController.purchased);
router.post("/lists/:listId/items/:id/unpurchased", itemController.unpurchased);



module.exports = router;