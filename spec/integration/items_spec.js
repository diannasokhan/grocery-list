const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/lists";

const sequelize = require("../../src/db/models/index").sequelize;
const List = require("../../src/db/models").List;
const Item = require("../../src/db/models").Item;

describe("routes : items", () => {

    beforeEach((done) => {
        this.list;
        this.item;

        sequelize.sync({force: true}).then((res) => {
            List.create({
                title: "Thursdays List",
                description: "Thursday dinner"
            }).then((list) => {
                this.list = list;

                Item.create({
                    name: "Ribs",
                    purchased: false,
                    listId: this.list.id
                }).then((item) => {
                    this.item = item;
                    done()
                })
            }).catch((err) => {
                console.log(err);
                done();
            });
        });
    });

    describe("GET /lists/:listId/items/new", () => {
        it("should render a new item form", (done) => {
            request.get(`${base}/${this.list.id}/items/new`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("New Item");
                done();
            });
        });
    });

    describe("POST /lists/:listId/items/create", () => {
        it("should create a new item and redirect", (done) => {
            const options = {
                url: `${base}/${this.list.id}/items/create`,
                form: {
                    name: "ribeye"
                }
            }
            request.post(options, (err, res, body) => {
                Item.findOne({
                    where: {name: "ribeye"}
                }).then((item) => {
                    expect(item).not.toBeNull();
                    expect(item.name).toBe("ribeye");
                    expect(item.purchased).toBe(false);
                    expect(item.listId).not.toBeNull();
                    done();
                }).catch((err) => {
                    console.log(err);
                    done();
                });
            });
        });
        
        it("should not create a new item that fails validations", (done) => {
            const options = {
                url: `${base}/${this.list.id}/items/create`,
                form: {
                    name:"a"
                }
            };
            request.post(options, (err, res, body) => {
                Item.findOne({
                    where: {name: "a"}
                }).then((item) => {
                    expect(item).toBeNull();
                    done();
                }).catch((err) => {
                    console.log(err);
                    done();
                })
            })
        })
    });

   describe("POST /lists/:listId/items/:id/destroy", () => {
       it("should delete the item with the associated ID", (done) => {
          
           expect(this.item.id).toBe(1);

           request.post(`${base}/${this.list.id}/items/${this.item.id}/destroy`, (err, res, body) => {

            Item.findByPk(1)
            .then((item) => {
                expect(err).toBeNull();
                expect(item).toBeNull();
                done();
                });
            });
        });
   });

   describe("GET /lists/:listId/items/:id/edit", () => {
       it("should render a view with an edit form", (done) => {
           request.get(`${base}/${this.list.id}/items/${this.item.id}/edit`, (err, res, body) => {
               expect(err).toBeNull();
               expect(body).toContain("Edit Item");
               expect(body).toContain("Ribs");
               done();
           });
       });
   });

   describe("POST /lists/:listId/items/:id/update", () => {
       it("should return a status code 302 and update the item with the given value", (done) => {
           request.post({
               url: `${base}/${this.list.id}/items/${this.item.id}/update`,
               form: {
                   name: "Beef Ribs"
               }
           }, (err, res, body) => {
               Item.findOne({
                   where: {id: this.item.id}
               }).then((item) => {
        
                expect(res.statusCode).toBe(302);
                expect(item.name).toBe("Beef Ribs")
                done();
               });
           });
       });
   });

   describe("POST /lists/:listId/items/:id/purchased", () => {
       it("should changed purchased from false to true", (done) => {
           request.post(`${base}/${this.list.id}/items/${this.item.id}/purchased`, (err, res, body) => {
               Item.findOne({
                   where: {id: this.item.id}
               }).then((item) => {
                   expect(err).toBeNull();
                   expect(item.purchased).toBe(true);
                   done();
               });
           });
       });
   });
   describe("POST /lists/:listId/items/:id/unpurchased", () => {
       beforeEach((done) => {
           sequelize.sync({force: true}).then((res) => {
               this.list2;
               this.item2;

               List.create({
                   title: "Monday Brunch",
                   description: "Groceries needed for brunch"
               }).then((list) => {
                   this.list2 = list;

                   Item.create({
                       name: "steak",
                       purchased: true,
                       listId: this.list2.id
                   }).then((item) => {
                       this.item2 = item;
                       done();
                   })
               }).catch((err) => {
                   console.log(err);
                   done();
               })
           })
       })
    it("should changed purchased from true to false", (done) => {
        request.post(`${base}/${this.list2.id}/items/${this.item2.id}/unpurchased`, (err, res, body) => {
            Item.findOne({
                where: {id: this.item2.id}
            }).then((item) => {
                expect(err).toBeNull();
                expect(item.purchased).toBe(false);
                done();
            });
        });
    });
});



})