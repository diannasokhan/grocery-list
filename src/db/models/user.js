'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {msg: "must be a valid email"}
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "member"
    }
  }, {});
  User.associate = function(models) {
    User.hasMany(models.List, {
      foreignKey: "userId",
      as: "lists"
    });

    User.hasMany(models.Item, {
      foreignKey: "userId",
      as: "items"
    })
  }

  User.prototype.isAdmin = function(){
    return this.role === "admin";
  }
  return User;
};