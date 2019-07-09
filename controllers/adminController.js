const fs = require('fs')
const db = require('../models')
const { User, Restaurant, Category } = db
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const adminService = require('../services/adminService')

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, data => {
      return res.render('admin/restaurants', data)
    })
  },

  createRestaurant: (req, res) => {
    adminService.createRestaurant(req, res, data => {
      return res.render('admin/create', data)
    })
  },

  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, data => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/restaurants')
    })
  },

  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, data => {
      return res.render('admin/restaurant', data)
    })
  },

  editRestaurant: (req, res) => {
    adminService.editRestaurant(req, res, data => {
      return res.render('admin/create', data)
    })
  },

  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, data => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/restaurants')
    })
  },

  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, data => {
      if (data['status'] === 'success') {
        return res.redirect('/admin/restaurants')
      }
    })
  },

  editUsers: async (req, res) => {
    const users = await User.findAll()
    res.render('admin/users', { users: users })
  },

  putUsers: async (req, res) => {
    const user = await User.findByPk(req.params.id)
    const { isAdmin } = user
    const updatedAdmin = !isAdmin
    const output = updatedAdmin ? 'admin' : 'user'
    await user.update({ isAdmin: updatedAdmin })

    req.flash('success_messages', `${output} was successfully to update`)
    res.redirect('/admin/users')
  }
}

module.exports = adminController
