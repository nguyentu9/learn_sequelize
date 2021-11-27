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
