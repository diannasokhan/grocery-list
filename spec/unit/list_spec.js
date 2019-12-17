const sequelize = require('../../src/db/models/index').sequelize;
const List = require('../../src/db/models').List;
const Item = require('../../src/db/models').Item;
const User = require('../../src/db/models').User;

describe("List", () => {
    beforeEach((done) => {
        this.list;
        this.item;
        this.user;
   
        sequelize.sync({force: true}).then((res) => {
          User.create({
            email: "ds@gmail.com",
            password: "hello12"
          })
          .then((user) => {
            this.user = user; 
            List.create({
              title: "Monday",
              description: "Groceries for lunch and dinner",
              userId: this.user.id,

              items: [{
                name: "banana",
                userId: this.user.id
              }]
            }, {

              include: {
                model: Item,
                as: "items"
              }
            })
            .then((list) => {
              this.list = list; 
              this.item = list.items[0]; 
              done();
            })
          })
        });
      });
    describe('#create()', () => {
        it("should create a List object with a title and body", (done) => {
            List.create({
                title: "Tuesday Dinner",
                description: "Everything needed",
                userId: this.user.id
            }).then((list) => {
                expect(list.title).toBe("Tuesday Dinner");
                expect(list.description).toBe("Everything needed");
                expect(list.userId).toBe(this.user.id)
                done();
            }).catch((err) => {
                console.log(err);
                done();
            });
        });
    });
    describe("#getItems()", () => {
        it("should return the associated items", (done) => {
            this.list.getItems()
            .then((associatedItems) => {
                expect(associatedItems[0].name).toBe("banana");
                done();
            });
        });
    });

    describe("#setUser()", () => {
        it("should associate a list and a user together", (done) => {
            User.create({
                email: "loopy12@gmail.com",
                password: "hello111"
            }).then((newUser) => {
                expect(this.list.userId).toBe(this.user.id);

                this.list.setUser(newUser)
                .then((list) => {
                    expect(this.list.userId).toBe(newUser.id);
                    done();
                });
            });
        });
    });

    describe("#getUser()", () => {
        it("should return the associated list", (done) => {
            this.list.getUser()
            .then((associatedUser) => {
                expect(associatedUser.email).toBe("ds@gmail.com");
                done();
            })
        })
    })
});