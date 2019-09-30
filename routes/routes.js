const express = require('express')
const router = express.Router()
const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')
const categoryController = require('../controllers/categoryController.js')
const commentController = require('../controllers/commentController.js')
const userController = require('../controllers/userController.js')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) {
      return next()
    }
    return res.redirect('/')
  }
  res.redirect('/signin')
}

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post(
  '/signin',
  passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }),
  userController.signIn
)
router.get('/logout', userController.logout)

router.use(authenticated)
router.get('/', (req, res) => res.redirect('/restaurants'))
router.get('/restaurants', restController.getRestaurants)
router.get('/restaurants/feeds', restController.getFeeds)
router.get('/restaurants/top', restController.getTopRestaurants)
router.get('/restaurants/:id', restController.getRestaurant)
router.get('/restaurants/:id/dashboard', restController.getDashboard)

router.get('/users/top', userController.getTopUser)
router.get('/users/:id', userController.getUser)
router.get('/users/:id/edit', userController.editUser)
router.put('/users/:id', upload.single('image'), userController.putUser)

router.post('/favorite/:restaurantId', userController.addFavorite)
router.delete('/favorite/:restaurantId', userController.removeFavorite)
router.post('/like/:restaurantId', userController.addLike)
router.delete('/like/:restaurantId', userController.removeLike)
router.post('/following/:userId', userController.addFollowing)
router.delete('/following/:userId', userController.removeFollowing)

router.post('/comments', commentController.postComment)

router.use(authenticatedAdmin)
router.delete('/comments/:id', commentController.deleteComment)

router.get('/admin', (req, res) => res.redirect('/admin/restaurants'))
router.get('/admin/restaurants', adminController.getRestaurants)
router.get('/admin/restaurants/create', adminController.createRestaurant)
router.post('/admin/restaurants', upload.single('image'), adminController.postRestaurant)
router.get('/admin/restaurants/:id', adminController.getRestaurant)
router.get('/admin/restaurants/:id/edit', adminController.editRestaurant)
router.put('/admin/restaurants/:id', upload.single('image'), adminController.putRestaurant)
router.delete('/admin/restaurants/:id', adminController.deleteRestaurant)

router.get('/admin/categories', categoryController.getCategories)
router.post('/admin/categories', categoryController.postCategory)
router.get('/admin/categories/:id', categoryController.getCategories)
router.put('/admin/categories/:id', categoryController.putCategory)
router.delete('/admin/categories/:id', categoryController.deleteCategory)

router.get('/admin/users', adminController.editUsers)
router.put('/admin/users/:id', adminController.putUsers)

module.exports = router
