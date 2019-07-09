const db = require('../models')
const Category = db.Category

const categoryService = {
  getCategories: async (req, res, callback) => {
    const categories = await Category.findAll()
    if (req.params.id) {
      const category = await Category.findByPk(req.params.id)
      res.render('admin/categories', { categories: categories, category: category })
    } else {
      callback({ categories: categories })
    }
  }
}

module.exports = categoryService
