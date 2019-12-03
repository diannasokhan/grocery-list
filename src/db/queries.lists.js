const List = require("./models").List;

module.exports = {
    getAllLists(callback){
        return List.findAll()
        .then((lists) => {
            callback(null, lists);
        }).catch((err) => {
            callback(err);
        })
    },
    addList(newList, callback){
        return List.create({
            title: newList.title,
            description: newList.description
        }).then((list) => {
            callback(null, list);
        }).catch((err) => {
            callback(err);
        })
    },
    getList(id, callback){
        return List.findByPk(id)
        .then((list) => {
            callback(null, list);
        }).catch((err) => {
            callback(err);
        })
    },
    deleteList(id, callback){
        return List.destroy({
            where: {id}
        })
        .then((list) => {
            callback(null, list);
        }).catch((err) => {
            callback(err);
        })
    },
    updateList(id, updatedList, callback){
        return List.findByPk(id)
        .then((list) => {
            if(!list){
                return callback("List not found");
            }
            list.update(updatedList, {
                fields: Object.keys(updatedList)
            }).then(() => {
                callback(null, list);
            }).catch((err) => {
                callback(err);
            })
        })
    }
}