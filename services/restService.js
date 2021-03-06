const db = require('../models')
const { User, Restaurant, Category, Comment } = db
const pageLimit = 10

const restService = {
  getRestaurants: async (req, res, callback) => {
    let whereQuery = {}
    let categoryId = ''
    let offset = 0
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['CategoryId'] = categoryId
    }
    const result = await Restaurant.findAndCountAll({
      include: Category,
      where: whereQuery,
      offset: offset,
      limit: pageLimit
    })
    const categories = await Category.findAll()
    let page = Number(req.query.page) || 1
    let pages = Math.ceil(result.count / pageLimit)
    let totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
    let prev = page - 1 < 1 ? 1 : page - 1
    let next = page + 1 > pages ? pages : page + 1

    const data = result.rows.map(r => ({
      ...r.dataValues,
      description: r.dataValues.description.substring(0, 50),
      isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id),
      isLiked: req.user.LikedRestaurants.map(d => d.id).includes(r.id)
    }))

    callback({ restaurants: data, categories, categoryId, page, totalPage, prev, next })
  },

  getRestaurant: async (req, res, callback) => {
    const restaurant = await Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' },
        { model: Comment, include: [User] }
      ]
    })
    const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id)
    const isLiked = restaurant.LikedUsers.map(d => d.id).includes(req.user.id)
    restaurant.viewCounts += 1

    await restaurant.save()

    callback({ restaurant: restaurant, isFavorited: isFavorited, isLiked: isLiked })
  },

  getDashboard: async (req, res, callback) => {
    const restaurant = await Restaurant.findByPk(req.params.id, {
      include: [Category, { model: User, as: 'FavoritedUsers' }, { model: Comment, include: [User] }]
    })

    callback({ restaurant: restaurant })
  },

  getFeeds: async (req, res, callback) => {
    const restaurants = await Restaurant.findAll({ limit: 10, order: [['createdAt', 'DESC']], include: [Category] })
    const comments = await Comment.findAll({ limit: 10, order: [['createdAt', 'DESC']], include: [User, Restaurant] })

    callback({ restaurants: restaurants, comments: comments })
  },

  getTopRestaurants: async (req, res, callback) => {
    const restaurants = await Restaurant.findAll({ include: [{ model: User, as: 'FavoritedUsers' }] })
    let resData = restaurants.map(restaurant => ({
      ...restaurant.dataValues,
      description: restaurant.dataValues.description ? restaurant.dataValues.description.substring(0, 50) : '',
      favoriteCount: restaurant.FavoritedUsers.length,
      // 判斷目前登入使用者是否已收藏該 Restaurant
      isFavorited: restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id)
    }))

    let filteredData = resData
      .filter(item => item.favoriteCount > 0)
      .sort((a, b) => b.favoriteCount - a.favoriteCount)
      .map((res, index) => ({ ...res, rank: index + 1 }))
      .slice(0, 10)

    callback({ restaurants: filteredData })
  }
}

module.exports = restService
