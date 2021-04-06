const createCategory = (categoryName) => {
    let user = {
        PK: `CATEGORY`,
        SK: `#CATEGORY#${categoryName}`,
        category_name: categoryName
    }

    params = {
        TableName: process.env.AWS_DYNAMODB_TABLE,
        Item: user,
        ConditionExpression: "attribute_not_exists(SK)"
    }

}

const getAllCategories = () => {
    params = {
        TableName: process.env.AWS_DYNAMODB_TABLE,
        KeyConditionExpression: "PK = :pk  and begins_with (SK, :sk)",
        ExpressionAttributeValues: {
            ":pk": "CATEGORY",
            ":sk": '#CATEGORY#'
        },
    }

    return dynamoDB.query(params).promise()
        .then(data => {
            return data.Items;
        });
}

const deleteCategory = async (categoryId) => {
    params = {
        TableName: process.env.AWS_DYNAMODB_TABLE,
        Key: {
            PK: 'CATEGORY',
            SK: `#CATEGORY#${categoryId}`
        },
    }

    return dynamoDB.delete(params).promise()
        .then(data => {
            return data.Items;
        });
}


module.exports = {
    createCategory,
    getAllCategories,
    deleteCategory

}