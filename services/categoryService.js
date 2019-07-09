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
  },

  postCategory: async (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: "name didn't exist" })
    } else {
      await Category.create({ name: req.body.name })
      callback({ status: 'success', message: 'category was successfully created' })
    }
  },

  putCategory: async (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: "name didn't exist" })
    } else {
      const category = await Category.findByPk(req.params.id)
      await category.update(req.body)
      callback({ status: 'success', message: 'category was successfully created' })
    }
  }
}

module.exports = categoryService
