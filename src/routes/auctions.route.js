const express = require('express');
const auctionsController = require('../controllers/auctions.controller');
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.route('/')
    .get(auctionsController.getAuctions)
    .post(authMiddleware, auctionsController.createAuction);

router.route('/category/:category')
    .get(auctionsController.getAuctionsByCategory);

router.route('/:id')
    .get(auctionsController.getAuctionById)
    .delete(auctionsController.removeAuctionById)


module.exports = router ;
