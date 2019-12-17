const express = require("express");
const router = express.Router();
const helper = require("../auth/helpers");

const listController = require("../controllers/listController");
const validation = require("./validation");

router.get("/lists", listController.index);
router.get("/lists/new", listController.new);
router.post("/lists/create", helper.ensureAuthenticated, validation.validateLists, listController.create);
router.get("/lists/:id", listController.show);
router.post("/lists/:id/destroy", listController.destroy);
router.get("/lists/:id/edit", validation.validateLists, listController.edit);
router.post("/lists/:id/update", listController.update);

module.exports = router;