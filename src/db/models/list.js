'use strict';
module.exports = (sequelize, DataTypes) => {
  const List = sequelize.define('List', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  List.associate = function(models) {
    // associations can be defined here
    List.hasMany(models.Item, {
      foreignKey: "listId",
      as: "items"
    })
    List.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    })
  };
  return List;
};