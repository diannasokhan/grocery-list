const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/lists";
const sequelize = require("../../src/db/models/index").sequelize;
const List = require("../../src/db/models").List;
const User = require("../../src/db/models").User;

describe("routes : lists", () => {

    beforeEach((done) => {
        this.list;
        this.user;
        sequelize.sync({force: true}).then((res) => {
            User.create({
                email: "ds@gmail.com",
                password: "hello12",
                role: "member"
            }).then((user) => {
                this.user = user;

                request.get({        
                    url: "http://localhost:3000/auth/fake",
                    form: {
                      role: user.role,     
                      userId: user.id,
                      email: user.email
                    }
                  });

                List.create({
                    title: "Monday's shopping list",
                    description: "Monday Dinner",
                    userId: this.user.id
                }).then((list) => {
                    this.list = list;
                    done();
                }).catch((err) => {
                    console.log(err);
                    done();
                });
            });
            })
    });

    describe("GET /lists", () => {

        it("should return all lists.", (done) => {

            request.get(base, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Monday's shopping list");
                expect(body).toContain("Lists");
                done();
            });
        });
    });

    describe("GET /lists/new", () => {
        it("should render a new list form", (done) => {
            request.get(`${base}/new`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("New List");
                done();
            });
        });
    });
    describe("POST /lists/create", () => {
        const options = {
            url: `${base}/create`,
            form: {
                title: "Tuesday's grocery list",
                description: "Tuesday dinner"
            
            }
        };
        it("should create a new list and redirect", (done) => {
            request.post(options, (err, res, body) => {
                List.findOne({where: {title: "Tuesday's grocery list"}})
                .then((list) => {
                    expect(res.statusCode).toBe(303);
                    expect(list.title).toBe("Tuesday's grocery list");
                    expect(list.description).toBe("Tuesday dinner");
                    done()
                }).catch((err) => {
                    console.log(err);
                });
            });
        });
        it("should not create a list that doesnt pass validation", (done) => {
            const options = {
                url: `${base}/create`,
                form: {
                    title: "hi",
                    description: "hello"
                }
            };
            request.post(options, (err, res, body) => {
                List.findOne({where: {title: "hi"}}).then((list) => {
                    expect(list).toBeNull();
                    done();
                }).catch((err) => {
                    console.log(err);
                    done();
                })
            })
        })
    });
    describe("GET /lists/:id", () => {
        it("should render a view with a selected list", (done) => {
            request.get(`${base}/${this.list.id}`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Monday's shopping list");
                done();
            });
        });
    });
    describe("POST /lists/:id/destroy", () => {
        it("should delete the list with the associated ID", (done) => {
            List.findAll()
            .then((lists) => {
                const listCountBeforeDelete = lists.length;
                expect(listCountBeforeDelete).toBe(1);

                request.post(`${base}/${this.list.id}/destroy`, (err, res, body) => {
                    List.findAll()
                    .then((lists) => {
                        expect(err).toBeNull();
                        expect(lists.length).toBe(listCountBeforeDelete - 1);
                        done();
                    });
                });
            });
        });
    });
     describe("GET /lists/:id/edit", () => {
            it("should render a view with an edit list form", (done) => {
                request.get(`${base}/${this.list.id}/edit`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).toContain("Edit List");
                    expect(body).toContain("Monday's shopping list");
                    done();
             });
        });
    });
    describe("POST /lists/:id/update", () => {
        it("should update the list with the given values", (done) => {
            const options = {
                url: `${base}/${this.list.id}/update`, 
                form: {
                    title: "Monday's list",
                    description: "dinner"
                }
            };
            request.post(options, (err, res, body) => {
                expect(err).toBeNull();
                List.findOne({
                    where: {id: this.list.id}
                }).then((list) => {
                    expect(list.title).toBe("Monday's list");
                    expect(list.description).toBe("dinner");
                    done();
                })
            })
        })
    })
})