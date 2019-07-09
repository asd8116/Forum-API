const db = require('../../models')
const { User, Restaurant, Category } = db
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminController = {
  // getRestaurants: (req, res) => {
  //   return Restaurant.findAll({ include: [Category] }).then(restaurants => {
  //     return res.json({ restaurants: restaurants })
  //   })
  // }
  getRestaurants: async (req, res) => {
    const restaurants = await Restaurant.findAll({ include: [Category] })
    res.json({ restaurants: restaurants })
  }
}

module.exports = adminController
