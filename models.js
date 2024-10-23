const sequilize = require('./db');
const {DataTypes} = require('sequelize')
const User = sequilize.define('user', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Использует встроенный метод генерации UUID
        primaryKey: true,
        unique: true,
    },
    chatId: {type: DataTypes.STRING, unique: true},
    right: {type: DataTypes.INTEGER, defaultValue: 0},
    wrong: {type: DataTypes.INTEGER, defaultValue: 0},

})

module.exports = User;
