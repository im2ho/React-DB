// server.js

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());

const oracledb = require('oracledb');
const dbConfig = {
  user: 'react',
  password: 'react',
  connectString: 'localhost:1521/XE',
};

let connection;

async function createUserTable() {
  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT table_name FROM all_tables WHERE table_name = 'USER_DATA' AND owner = :owner`,
      { owner: 'khk1' }
    );

    if (result.rows.length === 0) {
      await connection.execute(`
          CREATE TABLE USER_DATA (
            ID NUMBER GENERATED ALWAYS AS IDENTITY,
            NAME VARCHAR2(255),
            EMAIL VARCHAR2(255),
            PRIMARY KEY (ID)
          )
        `);

      console.log('USER_DATA 테이블이 생성되었습니다.');
    } else {
      console.log(
        'USER_DATA 테이블이 이미 존재합니다. 테이블을 생성하지 않습니다.'
      );
    }
  } catch (error) {
    console.error('테이블 생성 중 오류 발생:', error);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('데이터베이스 연결을 닫는 도중 오류 발생:', err);
      }
    }
  }
}

createUserTable();

app.post('/api/saveUserData', async (req, res) => {
  try {
    const { users } = req.body;
    console.log('데이터확인:', users);

    connection = await oracledb.getConnection(dbConfig);

    for (const user of users) {
      const { name, email } = user;

      await connection.execute(
        `INSERT INTO USER_DATA (NAME, EMAIL) VALUES (:name, :email)`,
        { name, email },
        { autoCommit: true }
      );
    }

    console.log('유저 데이터가 데이터베이스에 저장되었습니다.');
    res
      .status(200)
      .json({
        success: true,
        message: '유저 데이터가 데이터베이스에 저장되었습니다',
      });
  } catch (error) {
    console.error(
      '유저 데이터를 데이터베이스에 저장하는 도중 오류 발생:',
      error
    );
    res.status(500).json({ success: false, message: '내부 서버 오류' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('데이터베이스 연결을 닫는 도중 오류 발생:', err);
      }
    }
  }
});

app.listen(PORT, () => {
  console.log(`서버 포트 ${PORT} 실행 중`);
});