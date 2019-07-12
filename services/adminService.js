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

  editRestaurant: async (req, res, callback) => {
    const restaurant = await Restaurant.findByPk(req.params.id)
    const categories = await Category.findAll()
    callback({ categories: categories, restaurant: restaurant })
  },

  putRestaurant: async (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: "name didn't exist" })
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, async (err, img) => {
        const restaurantYes = await Restaurant.findByPk(req.params.id)
        await restaurantYes.update({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: file ? img.data.link : restaurant.image,
          CategoryId: req.body.categoryId
        })

        callback({ status: 'success', message: 'restaurant was successfully update' })
      })
    } else {
      const restaurantNo = await Restaurant.findByPk(req.params.id)
      await restaurantNo.update({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: restaurant.image,
        CategoryId: req.body.categoryId
      })

      callback({ status: 'success', message: 'restaurant was successfully update' })
    }
  },

  deleteRestaurant: async (req, res, callback) => {
    const restaurant = await Restaurant.findByPk(req.params.id)
    await restaurant.destroy()
    callback({ status: 'success', message: '' })
  },

  editUsers: async (req, res, callback) => {
    const users = await User.findAll()
    callback({ users: users })
  },

  putUsers: async (req, res, callback) => {
    const user = await User.findByPk(req.params.id)
    const { isAdmin } = user
    const updatedAdmin = !isAdmin
    const output = updatedAdmin ? 'admin' : 'user'
    await user.update({ isAdmin: updatedAdmin })

    callback({ status: 'success', message: `${output} was successfully to update` })
  }
}

module.exports = adminService
