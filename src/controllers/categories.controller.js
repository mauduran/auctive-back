const categoriesUtils = require('../utils/categories.utils');

const getCategories = async (req, res) => {
    try {
        categories = await categoriesUtils.getAllCategories();

        res.json({ success: true, categories });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: true, message: "Couldn't fetch categories" });
    }
}

const deleteCategoryById = async (req, res) => {
    const { id } = req.params;

    if (!id) return res.status(400).json({
        error: true,
        message: "Missing required fields"
    });

    if(!req._user.is_admin) return res.status(401).json({
        error: true,
        message: "Not authorized to do this operation."
    });

    try {
        notifications = await categoriesUtils.deleteCategory(id);

        res.json({ success: true, message: `Category ${id} removed` });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: true, message: "Couldn't delete category" });
    }
}

module.exports = {
    getCategories,
    deleteCategoryById,
}