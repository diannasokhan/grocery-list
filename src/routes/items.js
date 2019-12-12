const express = require("express");
const router = express.Router();

const itemController = require("../controllers/itemController");

router.get("/lists/:listId/items/new", itemController.new);
router.post("/lists/:listId/items/create", itemController.create);
router.post("/lists/:listId/items/:id/destroy", itemController.destroy);
router.get("/lists/:listId/items/:id/edit", itemController.edit);
router.post("/lists/:listId/items/:id/update", itemController.update);
router.post("/lists/:listId/items/:id/purchased", itemController.purchased);
router.post("/lists/:listId/items/:id/unpurchased", itemController.unpurchased);



module.exports = router;