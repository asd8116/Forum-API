const fs = require('fs')
const db = require('../models')
const { User, Restaurant, Category } = db
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminService = {
  getRestaurants: async (req, res, callback) => {
    const restaurants = await Restaurant.findAll({ include: [Category] })
    callback({ restaurants: restaurants })
  },

  getRestaurant: async (req, res, callback) => {
    const restaurant = await Restaurant.findByPk(req.params.id, { include: [Category] })
    callback({ restaurant: restaurant })
  },

  createRestaurant: async (req, res, callback) => {
    const categories = await Category.findAll()
    callback({ categories: categories })
  },

  editRestaurant: async (req, res, callback) => {
    const restaurant = await Restaurant.findByPk(req.params.id)
    const categories = await Category.findAll()
    callback({ categories: categories, restaurant: restaurant })
  },

  postRestaurant: async (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: "name didn't exist" })
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, async (err, img) => {
        await Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: file ? img.data.link : null,
          CategoryId: req.body.categoryId
        })

        callback({ status: 'success', message: 'restaurant was successfully created' })
      })
    } else {
      await Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: null,
        CategoryId: req.body.categoryId
      })

      callback({ status: 'success', message: 'restaurant was successfully created' })
    }
  },

  deleteRestaurant: async (req, res, callback) => {
    const restaurant = await Restaurant.findByPk(req.params.id)
    await restaurant.destroy()
    callback({ status: 'success', message: '' })
  }
}

module.exports = adminService
