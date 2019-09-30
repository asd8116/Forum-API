const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const passport = require('../config/passport')

const adminController = require('../controllers/api/adminController')
const categoryController = require('../controllers/api/categoryController')
const userController = require('../controllers/api/userController')
const restController = require('../controllers/api/restController')
const commentController = require('../controllers/api/commentController')

// const authenticated = passport.authenticate('jwt', { session: false })
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'No auth token' })
    }
    req.user = user
    return next()
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.isAdmin) {
      return next()
    }

    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

// JWT signin
router.post('/signup', userController.signUp)
router.post('/signin', userController.signIn)

router.use(authenticated)
router.get('/get_current_user', userController.getCurrentUser)

router.get('/', (req, res) => res.redirect('/api/restaurants'))
router.get('/restaurants', restController.getRestaurants)
router.get('/restaurants/feeds', restController.getFeeds)
router.get('/restaurants/top', restController.getTopRestaurants)
router.get('/restaurants/:id', restController.getRestaurant)
router.get('/restaurants/:id/dashboard', restController.getDashboard)

router.get('/users/top', userController.getTopUser)
router.get('/users/:id', userController.getUser)
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

router.get('/admin', (req, res) => res.redirect('/api/admin/restaurants'))
router.get('/admin/restaurants', adminController.getRestaurants)
router.get('/admin/restaurants/:id', adminController.getRestaurant)
router.post('/admin/restaurants', upload.single('image'), adminController.postRestaurant)
router.put('/admin/restaurants/:id', upload.single('image'), adminController.putRestaurant)
router.delete('/admin/restaurants/:id', adminController.deleteRestaurant)

router.get('/admin/users', adminController.editUsers)
router.put('/admin/users/:id', adminController.putUsers)

router.get('/admin/categories', categoryController.getCategories)
router.post('/admin/categories', categoryController.postCategory)
router.put('/admin/categories/:id', categoryController.putCategory)
router.delete('/admin/categories/:id', categoryController.deleteCategory)

module.exports = router
