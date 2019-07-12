const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
let jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = 'alphacamp'

let strategy = new JwtStrategy(jwtOptions, async (jwt_payload, next) => {
  const user = await User.findByPk(jwt_payload.id, {
    include: [{ model: Restaurant, as: 'FavoritedRestaurants' }, { model: Restaurant, as: 'LikedRestaurants' }, { model: User, as: 'Followers' }, { model: User, as: 'Followings' }]
  })

  if (!user) return next(null, false)
  return next(null, user)
})

passport.use(strategy)

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req, username, password, cb) => {
      const user = await User.findOne({ where: { email: username } })
      if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤'))
      if (!bcrypt.compareSync(password, user.password)) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
      return cb(null, user)
    }
  )
)

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})

passport.deserializeUser(async (id, cb) => {
  const user = await User.findByPk(id, {
    include: [{ model: Restaurant, as: 'FavoritedRestaurants' }, { model: Restaurant, as: 'LikedRestaurants' }, { model: User, as: 'Followers' }, { model: User, as: 'Followings' }]
  })

  return cb(null, user)
})

module.exports = passport
