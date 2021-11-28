const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("learnsequelize", "root", "12345678", {
    host: "localhost",
    dialect: "mysql",
    logging: false,
});

/*
const User = sequelize.define("user", {
    name: DataTypes.TEXT,
    favoriteColor: {
        type: DataTypes.TEXT,
        defaultValue: "green",
    },
    age: DataTypes.INTEGER,
    cash: DataTypes.INTEGER,
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});


(async () => {
    await sequelize.sync({ force: true });
    const jane = await User.create(
        { name: "jane", isAdmin: true },
        { fields: ["name"] }
    );

    const bob = await User.create({
        name: "bob",
        isAdmin: true,
    });

    await jane.reload();
    console.log(jane.toJSON());
    await bob.reload();
    console.log(bob.toJSON());

    const captains = await User.bulkCreate([
        { name: "Jack" },
        { name: "Davy" },
    ]);

    console.log(captains.length); //2
    console.log(captains[0] instanceof User); // true
    console.log(captains[0].name); // 'Jack Sparrow'
    console.log(captains[0].id);

    const users = await User.findAll();
    console.log(users.every((user) => user instanceof User));
    console.log("All users: ", JSON.stringify(users, null));
})();

*/

/*
const Foo = sequelize.define("foo", {
    bar: {
        type: DataTypes.TEXT,
        validate: {
            len: [4, 6],
        },
    },
});

// Nó sẽ ko báo lỗi, cả 2 instance sẽ được tạo
(async () => {
    await sequelize.sync({ force: true });
    await Foo.bulkCreate([{ name: "abc123" }, { name: "name too long" }]);
})();

// Nó sẽ báo lỗi, ko có gì được tạo ra
(async () => {
    await Foo.bulkCreate([{ name: "abc123" }, { name: "" }], {
        validate: true,
    });
})();
*/
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
    const rUser = await User.findAll({
        include: {
            model: Task,
            required: true,
        },
    });

    console.log(JSON.stringify(rUser, null, 2));
})();
