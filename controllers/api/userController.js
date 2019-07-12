const bcrypt = require('bcrypt-nodejs')
const db = require('../../models')
const { User, Comment, Restaurant, Favorite, Like, Followship } = db
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const userService = require('../../services/userService')
// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

let userController = {
  signUpPage: (req, res) => {
    return res.json()
  },

  signUp: (req, res) => {
    userService.signUp(req, res, data => {
      return res.json(data)
    })
  },

  signInPage: (req, res) => {
    return res.json()
  },

  signIn: async (req, res) => {
    // 檢查必要資料
    if (!req.body.email || !req.body.password) {
      return res.json({ status: 'error', message: "required fields didn't exist" })
    }
    // 檢查 user 是否存在與密碼是否正確
    let userEmail = req.body.email
    let password = req.body.password
    const user = await User.findOne({ where: { email: userEmail } })
    if (!user) return res.status(401).json({ status: 'error', message: 'no such user found' })
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ status: 'error', message: 'passwords did not match' })
    }
    let payload = { id: user.id }
    let token = jwt.sign(payload, process.env.JWT_SECRET)
    res.json({
      status: 'success',
      message: 'ok',
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    })
  },

  getTopUser: (req, res) => {
    userService.getTopUser(req, res, data => {
      return res.json(data)
    })
  },

  getUser: (req, res) => {
    userService.getUser(req, res, data => {
      return res.json(data)
    })
  },

  editUser: (req, res) => {
    userService.editUser(req, res, data => {
      return res.json(data)
    })
  },

  putUser: (req, res) => {
    userService.putUser(req, res, data => {
      return res.json(data)
    })
  },

  addFavorite: (req, res) => {
    userService.addFavorite(req, res, data => {
      return res.json(data)
    })
  },

  removeFavorite: (req, res) => {
    userService.removeFavorite(req, res, data => {
      return res.json(data)
    })
  },

  addLike: (req, res) => {
    userService.addLike(req, res, data => {
      return res.json(data)
    })
  },

  removeLike: (req, res) => {
    userService.removeLike(req, res, data => {
      return res.json(data)
    })
  },

  addFollowing: (req, res) => {
    userService.addFollowing(req, res, data => {
      return res.json(data)
    })
  },

  removeFollowing: (req, res) => {
    userService.removeFollowing(req, res, data => {
      return res.json(data)
    })
  }
}

module.exports = userController
