//server PORT
const PORT = 5003;

const oracledb = require('oracledb');
const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

//DB연결 정보
const dbConfig = {
    user: 'khcafe',
    password : 'khcafe',
    connectString : 'localhost:1521/xe',
};

//OracleDB 연결 위한 connection 과 SQL문 실행 함수 (비동기 작업)
//binds = [], options = {} 파라미터 필수 X (당장은 필요가 없다)
//binds = []
    //where Id 추가적으로 클라이언트가 넣어야지만 들어갈 수 있는 값을 넣어준다
    //runQuery(select * from cafe where id=cafeId,[cafeId])같이..
//options = {}
    //자동 커밋을 해야하거나 객체화로 변경해줄 때 사용
    //options는 다수가 존재할 수 있으므로 {} 안에 내용을 여러개 묶어서 사용할 수 있도록 함
async function runQuery(sql, binds=[], options={}){
    
    let connection;

    try{
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(sql,binds,options);

        return result.rows.map((row) => ({
            ID : row[0],
            LOCATION : row[1],
            NAME : row[2],
            OPERATING : row[3],
        }));
    } catch(err) {
        console.log(err);
    } finally {
        if(connection) {
            try {
                await connection.close();
            } catch(err) {
                console.log(err);
            }
        }
    }
}

//API사용해서 backend 연결 설정

//연결 테스트 주소
app.get("/", (request, response) => {
    response.send('연결 성공');
});

app.get("/cafes-list", async(request, response) => {
    const todos = await runQuery('SELECT * FROM cafe');
    response.json(todos);
});

//연결한 PORT에 정상적으로 연결 되었는지 확인 위해 console 출력
app.listen(PORT, () => {
    console.log(`SERVER started : http://localhost:${PORT}`);
});