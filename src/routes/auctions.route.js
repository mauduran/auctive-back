const express = require('express');
const auctionsController = require('../controllers/auctions.controller');
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.route('/')
    .post(authMiddleware, auctionsController.createAuction);


router.route('/:id')
    .get(auctionsController.getAuctionById)
    .delete(auctionsController.removeAuctionById)


module.exports = router ;
