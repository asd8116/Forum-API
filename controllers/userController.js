const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const { User, Comment, Restaurant, Favorite, Like, Followship } = db
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const userService = require('../services/userService')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    userService.signUp(req, res, data => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/signin')
    })
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  getTopUser: (req, res) => {
    userService.getTopUser(req, res, data => {
      return res.render('topUser', data)
    })
  },

  getUser: (req, res) => {
    userService.getUser(req, res, data => {
      return res.render('users/profile', data)
    })
  },

  editUser: (req, res) => {
    userService.editUser(req, res, data => {
      return res.render('users/edit', data)
    })
  },

  putUser: (req, res) => {
    userService.putUser(req, res, data => {
      if (data['status'] === 'success') {
        return res.redirect(`/users/${req.params.id}`)
      }
    })
  },

  addFavorite: async (req, res) => {
    await Favorite.create({ UserId: req.user.id, RestaurantId: req.params.restaurantId })
    res.redirect('back')
  },

  removeFavorite: async (req, res) => {
    const favorite = await Favorite.findOne({ where: { UserId: req.user.id, RestaurantId: req.params.restaurantId } })
    await favorite.destroy()
    res.redirect('back')
  },

  addLike: async (req, res) => {
    await Like.create({ UserId: req.user.id, RestaurantId: req.params.restaurantId })
    res.redirect('back')
  },

  removeLike: async (req, res) => {
    const like = await Like.findOne({ where: { UserId: req.user.id, RestaurantId: req.params.restaurantId } })
    await like.destroy()
    res.redirect('back')
  },

  addFollowing: async (req, res) => {
    await Followship.create({ followerId: req.user.id, followingId: req.params.userId })
    res.redirect('back')
  },

  removeFollowing: async (req, res) => {
    const followship = await Followship.findOne({ where: { followerId: req.user.id, followingId: req.params.userId } })
    await followship.destroy()
    res.redirect('back')
  }
}

module.exports = userController
