const Item = require("./models").Item;
const Authorizer = require("../policies/item");

module.exports = {
    addItem(newItem, callback){
        return Item.create(newItem)
        .then((item) => {
            callback(null, item);
        }).catch((err) => {
            callback(err);
        })
    },
    deleteItem(req, callback){

        return Item.findByPk(req.params.id)
        .then((item) => {
            const authorized = new Authorizer(req.user, item).destroy();
            if(authorized){
                item.destroy()
                .then((res) => {
                    callback(null, item);
                });
            }else{
                req.flash("notice", "You are not authorized to do that.");
                callback(401);
            }
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
    updateItem(req, updatedItem, callback){

        return Item.findByPk(req.params.id)
        .then((item) => {
            if(!item){
                return callback("Item not found");
            }

            const authorized = new Authorizer(req.user, item).update();

            if(authorized){
                item.update(updatedItem, {
                    fields: Object.keys(updatedItem)
                }).then(() => {
                    callback(null, item);
                }).catch((err) => {
                    callback(err);
                });
            }else{
                req.flash("notice", "You are not authorized too do that.");
                callback("Forbidden");
            }
        });
    },
    purchasedItem(req, callback){
        return Item.findByPk(req.params.id)
        .then((item) => {
            if(!item){
                return callback("Item not found");
            }

            const authorized = new Authorizer(req.user, item).update();

            if(authorized){
                item.update({
                    purchased: true
                }).then(() => {
                    callback(null, item);
                }).catch((err) => {
                    callback(err);
                });
            }else{
                req.flash("notice", "You are not authorized too do that.");
                callback("Forbidden");
            }
        });
    },
    unpurchasedItem(req, callback){
        return Item.findByPk(req.params.id)
        .then((item) => {
            if(!item){
                return callback("Item not found");
            }

            const authorized = new Authorizer(req.user, item).update();

            if(authorized){
                item.update({
                    purchased: false
                }).then(() => {
                    callback(null, item);
                }).catch((err) => {
                    callback(err);
                });
            }else{
                req.flash("notice", "You are not authorized too do that.");
                callback("Forbidden");
            }
        });
    }
}