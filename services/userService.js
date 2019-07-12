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
  }
}

module.exports = userService
