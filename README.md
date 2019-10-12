# 餐廳評論網

一個使用 Node.js/Express + MySQL/PostgreSQL 打造的美食餐廳評論網站，有眾多網友的分析與評論，以及人氣餐廳的排行，輕鬆找到心目中適宜的店家。

🌐 [Demo Website](https://forum-backend-api.herokuapp.com)

官方測試帳密登入：

```
管理員
  帳號：root@example.com
  密碼：12345678
```

## Picture

![image](https://i.imgur.com/08g4bym.jpg)

![image](https://i.imgur.com/rOzlzZl.jpg)

![image](https://i.imgur.com/ySpQaY7.jpg)

![image](https://i.imgur.com/gp6ewSl.jpg)

## Features

#### 前台

1. 使用者可以註冊/登入/登出網站，並依據狀況出現提示訊息
2. 使用者可以瀏覽所有餐廳，並用分類進行篩選
3. 使用者可以瀏覽個別餐廳詳細資料
4. 使用者可以對餐廳留下評論
5. 使用者可以收藏餐廳
6. 使用者可以查看最新的 10 筆餐廳 & 10 筆評論
7. 使用者可以追蹤其他的使用者
8. 使用者可以編輯自己的個人資料
9. 使用者可以查看自己評論過 & 收藏過的餐廳
10. 使用者可以查看自己追蹤中的使用者 & 正在追蹤自己的使用者

#### 後台

1. 只有網站管理者可以登入網站後台
2. 管理者可以在後台管理餐廳的基本資料
3. 管理者可以在後台管理餐廳分類
4. 管理者可以在後台設定使用著權限

## Environment SetUp

- [MySQL](https://downloads.mysql.com/archives/) - Database

* [Node.js](https://nodejs.org/en/) - JavaScript runtime built

- [Express](https://expressjs.com/zh-tw/starter/installing.html) - Node.js web framework

## Installing

啟動 MySQL 資料庫，開啟終端機並下載專案

```
git clone https://github.com/asd8116/Forum-API.git
```

從終端機導入目標檔案，並下載專案相依套件

```
npm install
```

環境變數設定

```
// 在專案根目錄創建.env檔案，填入相對應的值
JWT_SECRET=
IMGUR_CLIENT_ID=
```

在 MySQL Workbench 新建本機資料庫

```
CREATE DATABASE forum;
```

從終端機將 migration 導入至 forum 資料庫

```
npx sequelize-cli db:migrate
```

從終端機導入種子資料

```
npx sequelize-cli db:seed:all
```

啟動本地伺服器。

```
node app.js
```

成功連結後，瀏覽器輸入 http://localhost:3000，網頁即可運行！

```
官方帳密
  帳號：root@example.com
  密碼：12345678
```

## Contributor

> [馬振壹 Wanaka](https://github.com/asd8116)
