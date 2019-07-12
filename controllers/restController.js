const db = require('../models')
const { User, Restaurant, Category, Comment } = db
const pageLimit = 10
const restService = require('../services/restService')

const restController = {
  getRestaurants: (req, res) => {
    restService.getRestaurants(req, res, data => {
      return res.render('restaurants', data)
    })
  },

  getRestaurant: async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id, {
      include: [Category, { model: User, as: 'FavoritedUsers' }, { model: User, as: 'LikedUsers' }, { model: Comment, include: [User] }]
    })
    const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id)
    const isLiked = restaurant.LikedUsers.map(d => d.id).includes(req.user.id)
    restaurant.viewCounts += 1

    await restaurant.save()
    res.render('restaurant', { restaurant: restaurant, isFavorited: isFavorited, isLiked: isLiked })
  },

  getFeeds: (req, res) => {
    restService.getFeeds(req, res, data => {
      return res.render('feeds', data)
    })
  },

  getDashboard: async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id, {
      include: [Category, { model: User, as: 'FavoritedUsers' }, { model: Comment, include: [User] }]
    })
    res.render('dashboard', { restaurant: restaurant })
  },

  getTopRestaurants: (req, res) => {
    restService.getTopRestaurants(req, res, data => {
      return res.render('topRestaurants', data)
    })
  }
}

module.exports = restController
