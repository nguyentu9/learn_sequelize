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

### **TIMESTAMP**

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

### **KHỞI TẠO TRƯỜNG (CỘT) VỚI CÚ PHÁP VIẾT TẮT**

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

### **GIÁ TRỊ MẶC ĐỊNH**

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

### **KIỂU DỮ LIỆU**

-   Mỗi cột được định nghĩa trong model phải có kiểu dữ liệu. Sequelize cung cấp một số kiểu dữ liệu dựng sẳn. Để truy cập bạn phải import `DateTypes`:

```javascript
const { DataTypes } = require("sequelize");
```

**Strings**

```
DataTypes.STRING             // VARCHAR(255)
DataTypes.STRING(1234)       // VARCHAR(1234)
DataTypes.STRING.BINARY      // VARCHAR BINARY
DataTypes.TEXT               // TEXT
DataTypes.TEXT('tiny')       // TINYTEXT
```

**Boolean**

```
DataTypes.BOOLEAN            // TINYINT(1)
```

**Numbers**

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

**Unsigned & Zerofill integers - MySQL/MariaDB only**

-   Trong MySQL và MariaDB, kiểu `INTEGER`, `BIGINT`, `FLOAT` và `DOUBLE` có thể gán `unsigned` hoặc `zerofill` (hoặc cả hai), như sau:

```
DataTypes.INTEGER.UNSIGNED
DataTypes.INTEGER.ZEROFILL
DataTypes.INTEGER.UNSIGNED.ZEROFILL
// You can also specify the size i.e. INTEGER(10) instead of simply INTEGER
// Same for BIGINT, FLOAT and DOUBLE
```
