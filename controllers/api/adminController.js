const db = require('../../models')
const { User, Restaurant, Category } = db
const adminService = require('../../services/adminService')

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, data => {
      return res.json(data)
    })
  },

  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, data => {
      return res.json(data)
    })
  },

  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, data => {
      return res.json(data)
    })
  },

  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, data => {
      return res.json(data)
    })
  },

  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, data => {
      return res.json(data)
    })
  },

  editUsers: (req, res) => {
    adminService.editUsers(req, res, data => {
      return res.json(data)
    })
  },

  putUsers: (req, res) => {
    adminService.putUsers(req, res, data => {
      return res.json(data)
    })
  }
}

module.exports = adminController
