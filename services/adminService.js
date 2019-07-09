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
  }
}

module.exports = adminService
