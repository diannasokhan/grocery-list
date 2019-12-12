const sequelize = require("../../src/db/models/index").sequelize;
const List = require("../../src/db/models").List;
const Item = require("../../src/db/models").Item;

describe("Item", () => {
    beforeEach((done) => {
        this.list;
        this.item;
        sequelize.sync({force: true}).then((res) => {
            List.create({
                title: "Friday's List",
                description: "Friday dinnner"
            }).then((list) => {
                this.list = list;

                Item.create({
                    name: "apples",
                    purchased: false,
                    listId: this.list.id
                }).then((item) => {
                    this.item = item;
                    done();
                })
            }).catch((err) => {
                console.log(err);
                done();
            });
        });
    });

    describe("#create()", () => {
        it("should create an item object with a name and purchased value", (done) => {
            Item.create({
                name: "steak",
                purchased: false,
                listId: 1
            }).then((item) => {
                expect(item.name).toBe("steak");
                expect(item.purchased).toBe(false);
                done();
            }).catch((err) => {
                console.log(err);
                done();
            });
        });

        it("should not create a item with a missing name or purchased value", (done) => {
            Item.create({
                purchased: false,
            }).then((item) => {
                done();
            }).catch((err) => {
                expect(err.message).toContain("Item.name cannot be null");
                expect(err.message).toContain("Item.listId cannot be null");
                done();
            });
        });
    });

    describe("#setItem()", () => {
        it("should associate a list and an item together", (done) => {
            List.create({
                title: "Sunday list",
                description: "Sunday dinner"
            }).then((newList) => {
                expect(this.item.listId).toBe(this.list.id);

                this.item.setList(newList)
                .then((item) => {
                    expect(item.listId).toBe(newList.id);
                    done();
                });
            });
        });
    });

})