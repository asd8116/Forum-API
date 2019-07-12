const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const { User, Comment, Restaurant, Favorite, Like, Followship } = db
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userService = {
  signUp: async (req, res, callback) => {
    if (req.body.passwordCheck !== req.body.password) {
      return callback({ status: 'error', message: '兩次密碼輸入不同！' })
    } else {
      const user = await User.findOne({ where: { email: req.body.email } })
      if (user) {
        return callback({ status: 'error', message: '信箱重複！' })
      } else {
        await User.create({
          name: req.body.name,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
        })

        callback({ status: 'success', message: '成功註冊帳號！' })
      }
    }
  },

  getTopUser: async (req, res, callback) => {
    const users = await User.findAll({ include: [{ model: User, as: 'Followers' }] })
    let usersData = users.map(user => ({
      ...user.dataValues,
      // 計算追蹤者人數
      followerCount: user.Followers.length,
      // 判斷目前登入使用者是否已追蹤該 User 物件
      isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
    }))

    usersData = usersData.sort((a, b) => b.followerCount - a.followerCount)
    callback({ users: usersData })
  },

  getUser: async (req, res, callback) => {
    const user = await User.findByPk(req.params.id, {
      include: [{ model: Comment, include: [Restaurant] }, { model: Restaurant, as: 'FavoritedRestaurants' }, { model: User, as: 'Followings' }, { model: User, as: 'Followers' }]
    })
    const isFollowed = req.user.Followings.map(d => d.id).includes(user.id)

    let map = user.Comments.reduce((map, { Restaurant }) => {
      if (Restaurant && !map.has(Restaurant.id)) {
        map.set(Restaurant.id, Restaurant)
      }
      return map
    }, new Map())

    callback({ profile: user, isFollowed: isFollowed, restaurantArray: [...map.values()] })
  }
}

module.exports = userService
