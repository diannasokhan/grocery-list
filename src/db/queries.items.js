const Item = require("./models").Item;
const List = require("./models").List;

module.exports = {
    addItem(newItem, callback){
        return Item.create(newItem)
        .then((item) => {
            callback(null, item);
        }).catch((err) => {
            callback(err);
        })
    },
    deleteItem(id, callback){
        return Item.destroy({
            where: {id}
        }).then((deletedRecordsCount) => {
            callback(null, deletedRecordsCount);
        }).catch((err) => {
            callback(err);
        })
    },
    getItem(id, callback){
        return Item.findByPk(id)
        .then((item) => {
            callback(null, item);
        }).catch((err) => {
            callback(err);
        })
    },
    updateItem(id, updatedItem, callback){
        return Item.findByPk(id)
        .then((item) => {
            if(!item){
                return callback("Item not found");
            }
            item.update(updatedItem, {
                fields: Object.keys(updatedItem)
            }).then(() => {
                callback(null, item);
            }).catch((err) => {
                callback(err);
            })
        })
    },
    purchasedItem(id, callback){
        return Item.findByPk(id)
        .then((item) => {
            if(!item){
                return callback("Item not found");
            }
            item.update({
                purchased: true
            }).then(() => {
                callback(null, item);
            }).catch((err) => {
                callback(err);
            })
        })
    },
    unpurchasedItem(id, callback){
        return Item.findByPk(id)
        .then((item) => {
            if(!item){
                return callback("Item not found");
            }
            item.update({
                purchased: false
            }).then(() => {
                callback(null, item);
            }).catch((err) => {
                callback(err);
            })
        })
    }
}