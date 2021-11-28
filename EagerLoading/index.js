const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("learnsequelize", "root", "12345678", {
    host: "localhost",
    dialect: "mysql",
    logging: false,
});

// Eager Loading

const User = sequelize.define(
    "user",
    { name: DataTypes.STRING },
    { timestamps: false }
);
const Task = sequelize.define(
    "task",
    { name: DataTypes.STRING },
    { timestamps: false }
);

const Tool = sequelize.define(
    "tool",
    {
        name: DataTypes.STRING,
        size: DataTypes.STRING,
    },
    { timestamps: false }
);

User.hasMany(Task);
Task.belongsTo(User);

User.hasMany(Tool, { as: "Instruments" });

(async () => {
    await sequelize.sync({ force: true });
    const user = await User.create({ name: "John" });

    const task = await Task.create({ name: "A Task" });
    const instrument = await Tool.create({ name: "IN" });
    await user.addTask(task);
    await user.addInstruments(instrument);

    const tasks = await Task.findAll({ include: User });
    console.log(JSON.stringify(tasks, null, 2));
    console.log("===============");
    const users = await User.findAll({ include: Task });
    console.log(JSON.stringify(users, null, 2));

    console.log("===============");

    // Fetching an Aliased association
    const usersTool = await User.findAll({
        include: { model: Tool, as: "Instruments" },
    });
    console.log(JSON.stringify(usersTool, null, 2));
    // OR
    const u = await User.findAll({
        include: "Instruments",
    });
    console.log(JSON.stringify(u, null, 2));
})();
