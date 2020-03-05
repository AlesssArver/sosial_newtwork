const router = require('express').Router()
const { ensureAuthenticated } = require('../config/auth');

router.get('/profile',
    ensureAuthenticated,
    (req, res) => {
        res.render('profile', {
            auth: req.isAuthenticated(),
            user: {
                name: req.user.name,
                surname: req.user.surname,
                email: req.user.email,
                phone: req.user.phone
            }
        })
    })

router.get('/settings', ensureAuthenticated, (req, res) => {
    res.render('settings', { auth: req.isAuthenticated() })
})

module.exports = router;