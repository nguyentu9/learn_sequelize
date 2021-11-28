# EAGER LOADING

-   `Eager Loading` là hành động truy vấn dữ liệu của một số models cùng một lúc (một model 'chính' và một hoặc nhiều model được liên kết). Ở cấp độ SQL, đây là một truy vấn có một hoặc nhiều phép nối).

## Basic example

```js
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
```

## Fetching a single associated element

```js
const tasks = await Task.findAll({ include: User });
console.log(JSON.stringify(tasks, null, 2));
```

-   **Output:**

```js
[
    {
        name: "A Task",
        id: 1,
        userId: 1,
        user: {
            name: "John Doe",
            id: 1,
        },
    },
];
```
