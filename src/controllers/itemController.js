const itemQueries = require("../db/queries.items.js");
const listQueries = require("../db/queries.lists.js");
const Authorizer = require("../policies/item");

module.exports = {
    new(req, res, next){
        listQueries.getList(req.params.listId, (err, list) => {

            const authorized = new Authorizer(req.user, list).new();

            if(authorized){
                res.render("items/new", {listId: req.params.listId});
            }else{
                req.flash("You are not authorized to do that.");
                res.redirect(`/lists/${req.params.id}`)
            }
        })
    },
    create(req, res, next){

        listQueries.getList(req.params.listId, (err, list) => {

            const authorized = new Authorizer(req.user, list).create();

            if(authorized){
                let newItem = {
                    name: req.body.name,
                    listId: req.params.listId,
                    userId: req.user.id
                };
                itemQueries.addItem(newItem, (err, item) => {
        
                    if(err){
                        res.redirect(500, "/items/new");
                    }else{
                        res.redirect(303, `/lists/${item.listId}`)
                    }
                })
            }else{
                req.flash("You are not authorized to do that.");
                res.redirect(`/lists/${req.params.id}`)
            }
        })
        
    },

    destroy(req, res, next){
        itemQueries.deleteItem(req, (err, item) => {
            if(err){
                res.redirect(500, `/lists/${req.params.listId}/items/${req.params.id}`)
            }else{
                res.redirect(303, `/lists/${req.params.listId}`)
            }
        })
    },
    edit(req, res, next){
        itemQueries.getItem(req.params.id, (err, item) => {
            if(err || item == null){
                res.redirect(404, "/");
            }else{

                const authorized = new Authorizer(req.user, item).edit();

                if(authorized){
                    res.render("items/edit", {item});
                }else{
                    req.flash("You are not authorized to do that.");
                    res.redirect(`/lists/${req.params.listId}/items/${req.params.id}`)
                }
            }
        });
    },
    update(req, res, next){
        itemQueries.updateItem(req, req.body, (err, item) => {
            if(err || item == null){
                res.redirect(404, `/lists/${req.params.listId}/items/${req.params.id}/edit`)
            }else{
                res.redirect(`/lists/${req.params.listId}`)
            }
        })
    },
    purchased(req, res, next){
        itemQueries.purchasedItem(req, (err, item) => {
            if(err || item == null){
                res.redirect(404, `/lists/${req.params.listId}/items/${req.params.id}`)
            }else{
                res.redirect(`/lists/${req.params.listId}`)
            }
        })
    },
    unpurchased(req, res, next){
        itemQueries.unpurchasedItem(req, (err, item) => {
            if(err || item == null){
                res.redirect(404, `/lists/${req.params.listId}/items/${req.params.id}`)
            }else{
                res.redirect(`/lists/${req.params.listId}`)
            }
        })
    },
}