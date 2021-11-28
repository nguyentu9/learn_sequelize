```javascript
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("tên csdl", "tk", "mk", {
    host: "localhost",
    dialect: "mysql", // tên csdl
    logging: false, // tắt log mỗi khi thực hiện lệnh
});

const User = sequelize.define(
    "User", // tên model
    {
        // Định nghĩa thuộc tính
        firstName: {
            type: DataTypes.STRING,
            allowNull: false, // Không cho phép null
        },
        lastName: {
            type: DataTypes.STRING,
            // allowNull: true  : mặc định là true
        },
    },
    {
        // Thuộc tính cài đặt model ở đây
        freezeTableName: true, // tên bảng trong csdl giống với tên model

        // Cung cấp tên trực tiếp
        // tableName: 'User'
    }
);

console.log(User === sequelize.models.User); // true
```

## Đồng bộ

-   Tạo lại bảng nếu chưa có

          User.sync()

-   Tạo lại bảng, nhưng xoá trước nếu có tồn tại

          User.sync({ force: true })

-   Kiểm tra những trạng thái của bảng trong csdl (những cột, kiểu dữ liệu,..v.v) và sau đó thực hiện thay đổi cần thiết trên bảng cho giống với model

         User.sync({ alter: true })

-   Chỉ chạy khi tên csdl trùng với '\_test'

          sequelize.sync({ force: true , match: /_test$/ });

-   Xoá table User

          User.drop();

-   Xoá tất cả các bảng có trong csdl
    sequelize.drop();

### **Đồng bộ trên production**

-   `sync({ force: true })` và `sync({ alter: true })` có thể gây hư hỏng. Vì vậy, **`không khuyến khích`** sử dụng cho production-level. Thay vào đó, đồng bộ nên thực hiện với khái niệm nâng cao **`Migrations`**

## **TIMESTAMP**

-   Mặc định, Sequelize tự động thêm trường `createAt` và `updateAt` vào mỗi model, dùng kiểu dữ liệu DataTypes.DATE. Những trường đó tự đồng update mỗi khi thực hiện tạo và cập nhật.

    -   `createAt`: đại diện thời gian tạo
    -   `updateAt`: đại diện thời gian cập nhật mới nhất

-   **Ghi chú**: Chỉ thực hiện ở Sequelie level (không giống như _SQL triggers_). Nghĩa là khi thực hiện trực tiếp câu SQL (không thực hiện bởi Sequlize) thì những trường đó không được cập nhật tự động.
-   Để tắt hành vi đó cho một model thêm `timestamps: false`.

```javascript
sequelize.define(
    "User",
    {
        // ... (attributes)
    },
    {
        timestamps: false,
    }
);
```

-   Và ta cũng có thể mở 1 trong 2 `createAt` / `updateAt` và cung cấp tên tuỳ ý cho những trường đó.

```javascript
sequelize.define('User', {
    // ... (attributes)
}, {
    // Phải bật timestamps: true
    timestamps: true

    // Không muốn tạo trường createAt thì cho giá trị = false
    createAt: false

    // Tạo trường updateAt được gọi với tên khác [updateTimestamp]
    updateAt: 'updateTimestamp'
})
```

## **KHỞI TẠO TRƯỜNG (CỘT) VỚI CÚ PHÁP VIẾT TẮT**

-   Nếu chỉ có một thuộc tính với kiểu dữ liệu cụ thể, thì ta có thể viết tắt như sau:

```javascript
// Cú pháp ban đầu
sequelize.define("User", {
    name: {
        type: DataTypes.STRING,
    },
});

// Cú pháp viết tắt
sequelize.define("User", {
    name: DataTypes.STRING,
});
```

## **GIÁ TRỊ MẶC ĐỊNH**

-   Mặc định, Sequelize giả định giá trị của một cột là `NULL`. Để có thể thay đổi bằng cách chỉ định `defaultValue`

```javascript
sequelize.define("User", {
    name: {
        type: DataTypes.STRING,
        defaultValue: "John Doe",
    },
});
```

-   Một số trường hợp đặc biệt như `DateTypes.NOW` cũng được chấp nhận:

```javascript
sequelize.define("Foo", {
    bar: {
        type: DataTypes.DATETIME,
        defaultValue: DateTypes.NOW,
        // Bằng cách này, Thời gian hiện tại (date/time) sẽ được gán vào cột này (tại thời điểm được thêm)
    },
});
```

## **KIỂU DỮ LIỆU**

-   Mỗi cột được định nghĩa trong model phải có kiểu dữ liệu. Sequelize cung cấp một số kiểu dữ liệu dựng sẳn. Để truy cập bạn phải import `DateTypes`:

```javascript
const { DataTypes } = require("sequelize");
```

### **Strings**

```
DataTypes.STRING             // VARCHAR(255)
DataTypes.STRING(1234)       // VARCHAR(1234)
DataTypes.STRING.BINARY      // VARCHAR BINARY
DataTypes.TEXT               // TEXT
DataTypes.TEXT('tiny')       // TINYTEXT
```

### **Boolean**

```
DataTypes.BOOLEAN            // TINYINT(1)
```

### **Numbers**

```
DataTypes.INTEGER            // INTEGER
DataTypes.BIGINT             // BIGINT
DataTypes.BIGINT(11)         // BIGINT(11)

DataTypes.FLOAT              // FLOAT
DataTypes.FLOAT(11)          // FLOAT(11)
DataTypes.FLOAT(11, 10)      // FLOAT(11,10)

DataTypes.DOUBLE             // DOUBLE
DataTypes.DOUBLE(11)         // DOUBLE(11)
DataTypes.DOUBLE(11, 10)     // DOUBLE(11,10)

DataTypes.DECIMAL            // DECIMAL
DataTypes.DECIMAL(10, 2)     // DECIMAL(10,2)
```

### **Unsigned & Zerofill integers - MySQL/MariaDB only**

-   Trong MySQL và MariaDB, kiểu `INTEGER`, `BIGINT`, `FLOAT` và `DOUBLE` có thể gán `unsigned` hoặc `zerofill` (hoặc cả hai), như sau:

```
DataTypes.INTEGER.UNSIGNED
DataTypes.INTEGER.ZEROFILL
DataTypes.INTEGER.UNSIGNED.ZEROFILL
// Bạn có thể định nghĩa kích thước INTEGER(10) thay vì đơn giản là INTEGER
// giống với BIGINT, FLOAT và DOUBLE
```

### **Dates**

```
DataTypes.DATE       // DATETIME for mysql / sqlite, TIMESTAMP WITH TIME ZONE for postgres
DataTypes.DATE(6)    // DATETIME(6) for mysql 5.6.4+. Fractional seconds support with up to 6 digits of precision
DataTypes.DATEONLY   // DATE without time
```

### **UUIDs**

-   Đối với UUIDs, dùng `DateTypes.UUID`. Nó trở thành kiểu dữ liệu `UUID` cho PostgreSQL và SQLite, và `CHAR(36)` cho MySQL. Sequelize có thể tạo tự động UUIDs cho những trường này, đơn giản dùng `DataTypes.UUIDv1` hoặc `DataTypes.UUIDv4` làm giá trị mặc định.

```
{
  type: DataTypes.UUID,
  defaultValue: DataTypes.UUIDV4 // Or DataTypes.UUIDV1
}
```

### **Column Options**

-   Khi định nghĩa một cột, bên cạnh định nghĩa `type` cho cột, và `allowNull` và `defaultValue` được đề cập ở trên, có rất nhiều tuỳ chọn có thể dùng.

```javascript
const { Model, DataTypes, Deferrable } = require('sequelize');

class Foo extends Model {}
Foo.init({

    // khi khởi tạo sẽ tự tự động gán flag là true nếu không được gán giá trị
    flag: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }

    // giá trị mặc định là thời gian hiện tại
    myDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },

    // đặt allowNull thành false tự động thêm NOT NULL vào cột, có nghĩa là sẽ có một lỗi từ DB khi truy vấn được thực hiện nếu cột là NULL. Nếu bạn muốn kiểm tra rằng giá trị là NOT NULL trước khi truy vấn DB, tìm phần validations bên dưới.
    title: { type: DataTypes.STRING, allowNull: false },

    // Tạo 2 objects cùng giá trị sẽ báo lỗi. Thuộc tính unique có thể
    // là cả boolean và string. Nếu bạn cung cấp cùng một chuỗi cho nhiều cột,
    // chúng sẽ tạo thành một composite unique key.
    uniqueOne: { type: DataTypes.STRING, unique: 'compositeIndex'},
    uniqueTwo: { type: DataTypes.INTEGER, unique: 'compositeIndex'},

    // Thuộc tính unique đơn giản là một viết tắt để tạo một unique constraint
    someUnique: { type: DataTypes.STRING, unique: true },

    // Tiếp tục đọc thêm thông tin về primary key.
    identifier: { type: DataTypes.STRING, primaryKey: true },

    // autoIncrement dùng để tạo auto_incrementing integer columns
    incrementMe: { type: DataTypes.INTEGER, autoIncrement: true },

    //Bạn có thể chỉ định một tên tuỳ chỉnh cho cột qua thuộc tính `field`
    fieldWithUnderscores: { type: DataTypes.STRING, field: 'field_with_underscores'},

    // Có thể tạo khoá ngoại:
    bar_id: {
        type: DataTypes.INTEGER,

        references: {
            // Đây là một liên kết đến model khác
            model: Bar,

            // Đây là tên cột của model được liên kết
            key: 'id',
        }
    },

    // Comments có thể thêm vào cột trong MySQL, MariaDB, PostgreSQL and MSSQL
    commentMe: {
        type: DataTypes.INTEGER,
        comment: 'This is a column name that has a comment'
    }
}, {
    sequelize,
    modelName: 'foo',

    // Dùng `unique: true` trên một thuộc tính ở trên hoàn toàn giống với tạo index trong model's options
    indexes: [{ unique: true, fields: ['someUnique']}]
})
```

## **Tận dụng Models thành class**

-   Sequelize models là ES6 classes. Bạn có thể dễ dàng thêm tuỳ chỉnh instance và class level methods.

```javascript
class User extends Model {
    static classLevelMethod() {
        return "foo";
    }

    instanceLevelMethod() {
        return "bar";
    }

    getFullname() {
        return [this.firstname, this.lastname].join(" ");
    }
}

User.init(
    {
        firstname: Sequelize.TEXT,
        lastname: Sequelize.TEXT,
    },
    { sequelize }
);

console.log(User.classLevelMethod()); // 'foo'
const user = User.build({ firstname: "Jane", lastname: "Doe" });
console.log(user.instancelevelMethod()); // 'bar'
console.log(user.getFullName()); // 'Jane Doe'
```

# MODEL INSTANCES

-   Như bạn đã biết, một model là một ES6 class. Một thực thể (instance) của một lớp đại diện cho một object trong model đó (cái mà được ánh xạ một dòng của bảng trong cơ sở dữ liệu). Bằng cách này, model instances là DAOs.

```javascript
const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize("sqlite::memory:");

const User = sequelize.define("user", {
    name: DataTypes.TEXT,
    favoriteColor: {
        type: DataTypes.TEXT,
        defaultValue: "green",
    },
    age: DataTypes.INTEGER,
    cash: DataTypes.INTEGER,
});

(async () => {
    await sequelize.sync({ force: true });
    // Code here
})();
```

## Tạo một thực thế (instance)

-   Mặc dù một model là một class, bạn không nên tạo instances bằng cách dùng `new`. Thay vào đó, phương thức `build` nên được dùng:

```javascript
const jane = User.build({ name: "Jane" });
console.log(jane instanceof User); // true
console.log(jane.name);
```

-   Tuy nhiên, đoạn code trên hoàn toàn không thể giao tiếp với db (lưu ý rằng nó thậm chứ không bất đồng bộ). Điêu này là do phương thức `build` chỉ tạo một object đại diện cho dữ liệu rằng có thể ánh xạ tới csdl. Để thực sự có thể lưu (tức là vẫn tồn tại) instance này vào csdl, phương thức `save` nên được dùng nhu sau:

```javascript
await jane.save();
console.log("Jane was saved to the database");
```

-   Lưu ý, từ việc sử dụng await trong đoạn mã trên, lưu đó là một phương thức không đồng bộ. Trên thực tế, hầu hết mọi phương thức Sequelize là không đồng bộ; `build` là một trong số rất ít ngoại lệ.

## Viết tắt hữu ích: Phương thức create

-   Sequelize cung cấp phương thức `create`, cái mà được kết hợp phương thức `build` và `save` được hiển thị ở trên thành một phương thức duy nhất:

```javascript
const jane = await User.creat({ name: "Jane" });
// Jane exists in the database now!
console.log(jane instanceof User); // true
console.log(jane.name); // "Jane"
```

## Ghi chú: logging instances

-   Cố gắng log trực tiếp một model instance bằng `console.log` sẽ tạo rất nhiều lộn xộn, từ khi Sequelize instances có nhiều thứ được đính kèm vào chúng. Thay vào đó, bạn có thể dùng phương thức `.toJSON()` (bằng cách này, tự động đảm bảo instances thành `JSON.stringify`)

```javascript
const jane = await User.create({ name: "Jane" });
// console.log(jane); // Don't do this
console.log(jane.toJSON()); // This is good!
console.log(JSON.stringify(jane, null, 4)); // This is also good!
```

## Giá trị mặc định

-   Các instances được lấy giá trị mặc định

```javascript
const jane = User.build({ name: "Jane" });
console.log(jane.favoriteColor); // 'green'
```

## Cập nhật instance

-   Nếu bạn thay đổi giá trị một số trường của một instance, gọi `save` lần nữa để cập nhật:

```javascript
const jane = await User.create({ name: "Jane" });
console.log(jane.name); // 'Jane'
jane.name = "Ada";
// tên vẫn là 'Jane' trong csdl
await jane.save();
// Bây giờ tên đã được cập nhật thành 'Ada' trong csd
```

-   Bạn có thể cập nhật một số trường cùng lúc bằng phương thức `set`

```javascript
const jane = await User.create({ name: "Jane" });
jane.set({
    name: "Ada",
    favoriteColor: "blue",
});

// Như ở trên, csdl vẫn có 'Jane' và 'green'
await jane.save();
// CSDL bây giờ có 'Ada' và 'blue' cho name và favoriteColor
```

## Xoá một instance

-   Bạn có thể xoá một instance bằng cách gọi `destroy`:

```javascript
const jane = await User.create({ name: "Jane" });
console.log(jane.name); // 'Jane'
await jane.destroy();
// Bây giờ mục này đã bị xoá khỏi csdl
```

## Reload một instance

-   Bạn có thể tải lại một instance từ csdl bằng cách gọi `reload`:

```javascript
const jane = await User.create({ name: "Jane" });
jane.name = "Ada";
// Tên vẫn là 'Jane' trong csdl
await jane.reload();
console.log(jane.name); // 'Jane'
```

-   Lệnh `reload` tạo một câu truy vấn `SELECT` để lấy dữ liệu cập nhật từ csdl

## LƯU MỘT SỐ TRƯỜNG

-   Có thể xác định thuộc tính nào nên được lưu khi gọi `save`, bằng cách chuyển một mảng tên cột.

-   Điều này hữu ích khi bạn đặt các thuộc tính dựa trên một object đã xác định trước đó, chẳng hạn như khi bạn nhận các giá trị của một object thông qua một form của một web app. Hơn nữa, điều này được sử dụng nội bộ trong quá trình `update` được triển khai.

```javascript
const jane = await User.create({ name: "Jane" });
console.log(jane.name); // "Jane"
console.log(jane.favoriteColor); // "green"
jane.name = "Jane II";
jane.favoriteColor = "blue";
await jane.save({ fields: ["name"] });
console.log(jane.name); // Jane II
console.log(jane.favoriteColor); // 'blue'
// Ở trên in ra blue bởi vì local object được gán thành blue, nhưng trong csdl vẫn là green
```

## THAY ĐỔI NHẬN THỨC VỀ SAVE

-   Phương thức `save` được tối ưu hoá bên trong để chỉ cập nhật khi thực sự có thay đổi. Nghĩa là nếu bạn trong thay đổi thứ gì và gọi `save`, Sequelize sẽ biết rằng lưu là dư thừa và không là gì, không có truy vấn nào được tạo ra (nó vẫn trả về Promise, nhưng không resolve ngay tức thời).
-   Cũng như, nếu chỉ có một vài thuộc tính đã thay đổi khi bạn gọi `save`, chỉ nhưng trường đó sẽ được gửi trong câu truy vấn `UPDATE`, để nâng cao hiệu năng.

## TĂNG VÀ GIẢM GIÁ TRỊ SỐ NGUYÊN

-   Để tăng / giảm giá trị của một object mà không gặp phải các vấn đề đồng thời, Sequelize cung cấp các phương thức `increment` và `decrement`.

```javascript
const jane = await User.create({ name: "Jane", age: 100 });
const incrementResult = await jane.increment("age", { by: 2 });
// Ghi chú: để tăng giá trị lên 1, bạn có thể bỏ qua `by` và chỉ thực hiện `user.increment('age')`
// `incrementResult` sẽ là undefined. Nếu bạn cần cập nhật instance, bạn sẽ phải gọi `user.reload()
```

-   Bạn có thể tăng nhiều trường cùng lúc:

```javascript
const jane = await User.create({ name: "Jane", age: 100, cash: 5000 });
await jane.increment({
    age: 2,
    cash: 100,
});
// Nếu giá trị được tăng bằng nhau, bạn có thể dùng cú pháp này:
await jane.increment(["age", "cash"], { by: 2 });
```

-   Giảm (decrement) hoạt động cùng một cách.

# Model Querying - Basics

## Simple INSERT queries

-   Có thể định nghĩa thuộc tính nào được gán trong phương thức `create`. Nó có thể đặc biệc hữu ích nếu bạn tạo csdl dựa trên một form cái mà có thể được điền bởi người dùng.
-   VD: Sử dụng cái này có thể cho phép bạn giới hạn `User` model chỉ gán một `username` nhưng không gán admin flag( isAdmin);

```javascript
const user = await User.create(
    {
        username: "alice123",
        isAdmin: true,
    },
    { fields: ["username"] }
);
// Đảm bảo mặc định isAdmin là false
console.log(user.username); // alice123
console.log(user.isAdmin); // false
```

## Chỉ định một số thuộc tính cho câu SELECT

-   Để chọn một số thuộc tính, bạn có thể dùng `atrributes`:

```javascript
Model.findAll({
    attributes: ["foo", "bar"],
});

// SELECT foo, bar FROM ...
```

## Thuộc tính có thể được đổi tên bằng cách dùng nested array:

```javascript
Model.findAll({
    attributes: ["foo", ["bar", "baz"], "qux"],
});
// SELECT foo, bar AS baz, qux FROM ...
```

-   Bạn có thể dùng `sequelize.fn` để thực hiện `aggregations`

```javascript
Model.findAll({
    attributes: [
        "foo",
        [sequelize.fn("COUNT", sequelize.col("hats")), "n_hats"],
        "bar",
    ],
});
// SELECT foo, COUNT(hats) AS n_hats, bar FROM ...
```

-   Khi sử dụng `aggregation function`, bạn phải cung cấp một alias để có thể truy cập nó từ `model`. Trong ví dụ ở trên bạn có lấy số `hats` với `instance.n_hats`
-   Đôi khi nó có thể gây mệt mỏi khi liệt kê tất cả thuộc tính của một `model` nếu bạn chỉ muốn thêm một `aggregation`:

```javascript
// Đây là cách mệt mỏi để có được số hats (cùng với mỗi cột)
Model.findAll({
    attributes: [
        "id",
        "foo",
        "bar",
        "baz",
        "qux",
        "hats", // Chúng ta liệt kê tất cả thuộc tính...
        [sequelize.fn("COUNT", sequelize.col("hats")), "n_hats"], // Để thêm aggregation
    ],
});

// Đây là cách ngắn hơn, và ít lỗi hơn bởi vì nó vẫn hoạt động nếu bạn thêm/bỏ bớt thuộc tính từ `model` của bạn sau này
Model.findAll({
    attributes: {
        include: [[sequelize.fn("COUNT", sequelize.col("hats")), "n_hats"]],
    },
});
// SELECT id, foo, bar, baz, qux, hats, COUNT(hats) AS n_hats FROM ...
```

-   Tương tự, nó cũng có thể bỏ bớt một vài thuộc tính được chọn

```javascript
Model.findAll({
    attributes: { exclude: ["baz"] },
});
//-- Assuming all columns are 'id', 'foo', 'bar', 'baz' and 'qux'
//SELECT id, foo, bar, qux FROM ...
```

## Áp dụng mệnh đề WHERE

-   `where` dùng để lọc câu truy vấn. Có nhiều toán tử dùng cho mệnh đề `where`, sẳn dùng là ký tự từ `Op`.

### Cơ bản

```javascript
Post.findAll({
    where: {
        authorId: 2,
    },
});
// SELECT * FROM post WHERE authorId = 2
```

-   Quan sát rằng không có toán tử (từ `Op`) được truyền rõ rằng, vì vậy Sequelize giả định mặc định là một so sánh bằng. Code phía trên tương đương với:

```javascript
const { Op } = require("sequelize");
Post.findAll({
    where: {
        authorId: {
            [Op.eq]: 2,
        },
    },
});
// SELECT * FROM Post WHERE authorId = 2;
```

-   Nhiều kiểm tra có thể truyền như sau:

```javascript
Post.findAll({
    where: {
        authorId: 12,
        status: "active",
    },
});
```

-   Giống với Sequelize được suy ra toán tử `Op.eq` trong ví dụ đầu tiên, ở đâu Sequelize suy ra rằng người gọi muốn một `AND` cho 2 kiểm tra. Code ở trên tương đương với:

```javascript
const { Op } = require("sequelize");
Post.findAll({
    where: {
        [Op.and]: [{ authorId: 12 }, { status: "active" }],
    },
});
// SELECT * FROM post WHERE authorId = 12 AND status = 'active';
```

-   `OR` có thể được thực hiện theo cách tương tự:

```javascript
const { Op } = require("sequelize");
Post.findAll({
    where: {
        [Op.or]: [{ authorId: 12 }, { authorId: 13 }],
    },
});
// SELECT * FROM post WHERE authorId = 12 OR authorId = 13;
```

-   Từ khi ở trên `OR` kèm theo cùng field, Sequelize cho phép bạn sử dụng cấu trúc hơi khác cái mà dễ đọc hơn và tạo ra cùng một hành vi:

```js
const { Op } = require("sequelize");
Post.destroy({
    where: {
        authorId: {
            [Op.or]: [12, 13],
        },
    },
});
// DELETE FROM post WHERE authorId = 12 OR authorId = 13;
```

## Một số toán tử

```js
const { Op } = require("sequelize");
Post.findAll({
    where: {
        [Op.and]: [{ a: 5 }, { b: 6 }], // (a = 5) AND (b = 6)
        [Op.or]: [{ a: 5 }, { b: 6 }], // (a = 5) OR (b = 6)
        someAttribute: {
            // Basics
            [Op.eq]: 3, // = 3
            [Op.ne]: 20, // != 20
            [Op.is]: null, // IS NULL
            [Op.not]: true, // IS NOT TRUE
            [Op.or]: [5, 6], // (someAttribute = 5) OR (someAttribute = 6)

            // Using dialect specific column identifiers (PG in the following example):
            [Op.col]: "user.organization_id", // = "user"."organization_id"

            // Number comparisons
            [Op.gt]: 6, // > 6
            [Op.gte]: 6, // >= 6
            [Op.lt]: 10, // < 10
            [Op.lte]: 10, // <= 10
            [Op.between]: [6, 10], // BETWEEN 6 AND 10
            [Op.notBetween]: [11, 15], // NOT BETWEEN 11 AND 15

            // Other operators

            [Op.all]: sequelize.literal("SELECT 1"), // > ALL (SELECT 1)

            [Op.in]: [1, 2], // IN [1, 2]
            [Op.notIn]: [1, 2], // NOT IN [1, 2]

            [Op.like]: "%hat", // LIKE '%hat'
            [Op.notLike]: "%hat", // NOT LIKE '%hat'
            [Op.startsWith]: "hat", // LIKE 'hat%'
            [Op.endsWith]: "hat", // LIKE '%hat'
            [Op.substring]: "hat", // LIKE '%hat%'
            [Op.iLike]: "%hat", // ILIKE '%hat' (case insensitive) (PG only)
            [Op.notILike]: "%hat", // NOT ILIKE '%hat'  (PG only)
            [Op.regexp]: "^[h|a|t]", // REGEXP/~ '^[h|a|t]' (MySQL/PG only)
            [Op.notRegexp]: "^[h|a|t]", // NOT REGEXP/!~ '^[h|a|t]' (MySQL/PG only)
        },
    },
});
```

## Cú pháp viết tắt cho `Op.in`

-   Truyền trực tiếp một mảng vào `where` sẽ dùng toán tử `IN` không tường minh:

```js
Post.findAll({
    where: {
        id: [1, 2, 3], // Giống với `id: { [Op.in]: [1,2,3]}`
    },
});
```

## Kết hợp logic với toán tử

-   Toán tử `Op.and`, `Op.or` và `Op.not` có thể dùng để tạo ra biểu thức so sánh logic phức tạp tuỳ ý.

```js
const { Op } = require('sequelize')
Foo.findAll({
    where: {
        rank: {
            [Op.or]: {
                [Op.lt]: 1000,
                [Op.eq]: null
            }
        },
        // rank < 1000 OR rank is NULL

        {
            createAt: {
                [Op.lt]: new Date(),
                [Op.gt]: new Date(new Date() - 24 * 60 * 60 * 1000)
            }
        },
        // createAt < [timestamp] AND createAt > [timestamp]

        {
            [Op.or]: [
                {
                    title: {
                        [Op.like]: 'Boat%'
                    }
                },
                {
                    description: {
                        [Op.like]: '%boat%'
                    }
                }
            ]
        }
        // title LIKE 'Boat%' OR description LIKE '%boat%'
    }
});
```

## Ví dụ với Op.not

```js
Project.findAll({
    where: {
        name: 'Some object',
        [Op.not]: {
            { id: [1,2,3]},
            {
                description: {
                    [Op.like]: 'Hello%'
                }
            }
        }
    }
});
```

-   Code ở trên sẽ tạo ra:

```sql
SELECT *
FROM `Projects`
WHERE (
  `Projects`.`name` = 'Some Project'
  AND NOT (
    `Projects`.`id` IN (1,2,3)
    AND
    `Projects`.`description` LIKE 'Hello%'
  )
)
```

## Truy vấn nâng cao với funcions(không chỉ những cột)

-   Cái bạn muốn đạt được giống như `WHERE char_length('content') = 7` ?

```js
Post.findAll({
    where: sequelize.where(
        sequelize.fn("char_length", seuquelize.col("content")),
        7
    ),
});
// SELECT ... FROM posts as post WHERE char_length('content') = 7
```

-   Lưu ý việc sử dụng các phương thức `sequize.fn` và `sequize.col`, các phương thức này sẽ được sử dụng để chỉ định một lệnh gọi hàm SQL và một cột, tương ứng. Các phương thức này nên được sử dụng thay vì truyền một chuỗi thuần túy (chẳng hạn như char_length (nội dung)) vì Sequelize cần xử lý tình huống này theo cách khác (ví dụ: sử dụng các cách tiếp cận thoát ký hiệu khác).

```js
Post.findAll({
    where: {
        [Op.or]: [
            sequelize.where(sequelize.fn('char_length', sequelize.col('content')), 7),
            {
                content: {
                    [Op.like]: 'Hello%'
                }
            },
            [Op.and]: [
                { status: 'draft'},
                sequelize.where(sequelize.fn('char_length'), sequelize.col('content')), {
                    [Op.gt]: 10
                }
            ]
        ]
    }
})
```

-   Đoạn code trên tương đương:

```sql
SELECT
  ...
FROM "posts" AS "post"
WHERE (
  char_length("content") = 7
  OR
  "post"."content" LIKE 'Hello%'
  OR (
    "post"."status" = 'draft'
    AND
    char_length("content") > 10
  )
)
```

## Simple UPDATE queries

-   Truy vấn Update cũng chấp nhận tuỳ chọn `where`:

```js
// Đổi mọi người không có tên thành 'Doe'
await User.update(
    { lastName: "Doe" },
    {
        where: {
            lastName: null,
        },
    }
);
```

## Simple DELETE queries

-   Truy vấn Delete cũng chấp nhận tuỳ chọn `where`:

```js
// Xoá tất cả mọi người có tên là 'Jane'
await User.destroy({
    where: {
        firstName: "Jane",
    },
});
```

-   Để xoá mọi thứ SQL `TRUNCATE` có thể sử dụng:

```js
// Truncate the table
await User.destroy({
    truncate: true,
});
```

## Create in bulk

-   Sequelize cung cấp phương thức `Model.bulkCreate` cho phép tạo nhiều records cùng một lúc, chỉ với 1 câu truy vấn.
-   Cách sử dụng `Model.bulkCreate` khá giống với `Model.create`, bằng cách nhận vào 1 mảng object thay vì 1 object

```js
const captains = await Captain.bulkCreate([
    { name: "Jack Sparrow" },
    { name: "Davy Jones" },
]);
console.log(captains.length); //2
console.log(captains[0] instanceof User); // true
console.log(captains[0].name); // 'Jack Sparrow'
console.log(captains[0].id);
```

-   Tuy nhiên, mặc định, `bulkCreate` sẽ không chạy `validations` cho mỗi object được tạo (cái mà `create` làm). Để `buildCreate` chạy những `validations` đó, bạn phải truyền `validate: true`. Nó sẽ giảm hiệu năng. Dùng ví dụ sau:

```js
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
```

-   Nếu bạn nhận giá trị trực tiêp từ người dùng, nó có thể có lợi cho việc giới hạn những cột bạn sự thực muốn thêm. Để hỗ trợ việc đó, `bulkCreate()` nhận một tuỳ chọn `fields`, một mảng định nghĩa những trường nào được xem xét (còn lại sẽ bị bỏ qua)

```js
await User.bulkCreate([{ username: "foo" }, { username: "bar", admin: true }], {
    fields: ["username"],
});
```

## Ordering và Grouping

-   Sequelize cung cấp `order` và `group` để hoạt động với `ORDER BY` và `GROUP BY`.

### Ordering

-   Tuỳ chọn `order` lấy một mảng các phần tử để sắp xếp truy vấn bằng hoặc một phương thức sequelize.
-   Những bản thân những phần tử này là mảng theo mẫu `[column, direction]`. Cột sẽ được escapsed chính xác và direction sẽ được kiểm tra trong danh sách direction hợp lệ (như `ASC`, `DESC`, `NULLS FIRST`, etc).

```js
Subtask.findAll({
    order: [
        // Will escape title and validate DESC against a list of valid direction parameters
        ["title", "DESC"],

        // Sẽ sắp xếp theo max(age)
        sequelize.fn("max", sequelize.col("age")),

        // Sẽ sắp xếp theo max(age) DESC
        [sequelize.fn("max", sequelize.col("age")), "DESC"],

        // Sẽ sắp xếp theo orderfunction('col1', 12, 'lalala') DESC
        [
            sequelize.fn("otherfunction", sequelize.col("col1"), 12, "lalala"),
            "DESC",
        ],

        // Sẽ sắp xêp theo createAt của model được liên kết dùng tên model như là tên của liên kết
        [Task, "createAt", "DESC"],

        // Sẽ sắp xếp thông qua createAt của model được liên kết dùng tên của model như là tên của liên kết
        [Task, Project, "createAt", "DESC"],

        // Sẽ sắp xếp theo createAt của model được liên kết bằng cách dùng tên của liên kết.
        ["Task", "Project", "createAt", "DESC"],

        // Sẽ sắp xêp theo createAt của model được liên kết bằng cách dùng một object liên kết. (Phương pháp ưu thích)
        [Subtask.associations.Task, "createAt", "DESC"],

        //Sẽ sắp xếp theo createAt của model được liên kết lồng sử dụng object liên kết (Phương pháp ưu thích).
        [
            Subtask.associations.Task,
            Task.associations.Project,
            "createAt",
            "DESC",
        ],

        // Sẽ sắp xếp theo createAt của model được liên kết bằng cách dùng một object liên kết đơn giản
        [{ model: Task, as: "Task" }, "createAt", "DESC"],

        // Sẽ sắp xếp theo createAt của model được liên kết lồng bằng cách dùng một object liên kết đơn giản
        [
            { model: Task, as: "Task" },
            { model: Project, as: "Project" },
            "createAt",
            "DESC",
        ],
    ],

    // Sẽ sắp xếp theo tuổi lớn nhất giảm dần
    order: sequelize.literal("max(age) DESC"),

    // Sẽ sắp xếp theo tuổi lớn nhất tăng dần giả định tăng dần là sắp xếp mặc định khi direction bị bỏ qua
    order: sequelize.fn("max", sequelize.col("age")),

    // Sẽ sắp xếp theo tuổi tăng dần giả định tăng dần là sắp xếp mặc định khi direction bị bỏ qua
    order: sequelize.col("age"),

    // Will order randomly based on the dialect (instead of fn('RAND') or fn('RANDOM'))
    order: sequelize.random(),
});

Foo.findOne({
    order: [
        // Sẽ trả về 'name'
        ["name"],

        // Sẽ trả về 'username' DESC
        ["username", "DESC"],

        // sẽ trả về max('age')
        sequelize.fn("max", sequelize.col("age")),

        // sẽ trả
    ],
});
```
