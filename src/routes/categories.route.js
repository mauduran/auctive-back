const express = require('express');
const categoriesController = require('../controllers/categories.controller')
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.route('/')
    .get(categoriesController.getCategories)
    .post(authMiddleware, categoriesController.addCategory);


router.route('/:id')
    .delete(authMiddleware, categoriesController.deleteCategoryById);


module.exports = router;
