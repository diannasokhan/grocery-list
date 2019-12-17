const ApplicationPolicy = require("./application");

module.exports = class ItemPolicy extends ApplicationPolicy {


  new() {
    return this._isAdmin() || this._isOwner();
  }

  create() {
    return this.new();
  }

  edit() {
    return this.create();
  }

  update() {
    return this.edit();
  }

  destroy() {
    return this.update();
  }
}