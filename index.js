const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("learnsequelize", "root", "12345678", {
    host: "localhost",
    dialect: "mysql",
    // logging: false,
});

const User = sequelize.define(
    "User",
    {
        // Model attributes are defined here
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            // allowNull defaults to true
        },
    },
    {
        // Other model options go here
        freezeTableName: true, // Enforcing the table name to be equal to the model name

        // Providing the table name directly
        // tableName: 'User'
    }
);

console.log(User === sequelize.models.User);

async function fun() {
    await User.sync({ force: true });
    console.log("The table for the User model was just (re)created!");

    // Xoá table User
    await User.drop();

    await sequelize.drop();
}

// fun();
