const { cloudSearch, dynamoDB } = require('../../config/aws.config');

const createAuction = async (auction) => { }

const findAuctions = async (query) => {
    params = {
        query,
        size: 20

    }
    let result = await cloudSearch.search(params).promise();

    const results = result.hits.hit;

    results.forEach((el) => console.log(el));
    return results;
}

const findAuctionById = async (auctionId) => {

}

const findAuctionsByCategory = async (category, query = '') => {

    params = {
        query: `category:'${category}, ${query}'`,
        queryParser: "lucene",
        size: 20

    }
    let result = await cloudSearch.search(params).promise();

    const results = result.hits.hit;

    results.forEach((el) => console.log(el));
    return results;
}

const updateAuctionWithBid = async (auctionId, ownerId, bid) => { }

const buyNow = async (auctionId, bidder) => { }

const subscribeToAuction = async (auctionId, email) => { }

const deleteAuction = async (auctionId) => { }

const updateAuction = async (auctionId, auction) => { }

module.exports = {
    createAuction,
    findAuctions,
    findAuctionById,
    findAuctionsByCategory,
    updateAuctionWithBid,
    deleteAuction,
    updateAuction,
    buyNow,
    subscribeToAuction
}