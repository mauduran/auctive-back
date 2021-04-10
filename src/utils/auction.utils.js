

/*TODO: Create Auction, upload images to S3 bucket, then create document. 
Add auction schedule to db. Schedule event to close auction when auction ends. */
const createAuction = async (auction) => { }


/* TODO: Given new bid check is it is greater than the current or if there is no current bid and that auction is open.
** if those conditions are satisfied, update auction document.
*/
const updateAuctionWithBid = async (auctionId, ownerId, newBid, bidderEmail) => {
    //Example of params with condition expression.
    //const params = {
    //     ExpressionAttributeValues: {
    //         ":a": x
    //     },
    //     Key: {
    //         id: "1",
    //         Category: "used"
    //     },
    //     ConditionExpression: "amount < :a",
    //     ReturnValues: "ALL_NEW",
    //     TableName: "products",
    //     UpdateExpression: "SET amount= :a"
    // }
}

// TODO: Check if auction is open, if it is update the auction document and close auction. Set bidder (Cancel scheduled closing)
const buyNow = async (auctionId, bidder) => { }

// TODO: Add user email to array of interested people on auction.
const subscribeToAuction = async (auctionId, ownerId, email) => { }

// TODO: Logical Delete.  Set status of auction to Deleted
const deleteAuction = async (auctionId) => { }

// TODO: Change values and information on existing auction. Only if auction is Expired
const updateAuction = async (auctionId, auction) => { }

module.exports = {
    createAuction,
    findAuctions,
    updateAuctionWithBid,
    deleteAuction,
    updateAuction,
    buyNow,
    subscribeToAuction
}