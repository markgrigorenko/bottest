const {Sequelize} = require('sequelize')

module.exports = new Sequelize(
    'dbnew',
    'root',
    'root',
    {
        host: '34.72.168.87',
        port: '5432',
        dialect: 'postgres'
    }
)
