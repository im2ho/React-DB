//oracledb, express 요청 함수 작성 
//express : jdbc와 같이 DB연결에 중간 역할 담당
const oracledb = require('oracledb');
const express = require('express');

//가져온 express를 사용하기 위한 app 생성
const app = express();

//express로 백엔드에서 가져온 데이터를 사용할 수 있도록 설정
//express에서 json파일로 DB를 보여주는 것을 허용 > json 형식으로 데이터 보이기
app.use(express.json());

//백엔드 전용 포트번호
const PORT = 5002;

//npm i cors
//현재 도메인에서 포트번호를 5052만 사용하는 것이 아니라
//리액트에서 가지고 온 포트번호도 사용할 것이기 때문에 cors를 사용
const cors = require('cors');

//모든 경로에서 백엔드에 오는 요청을 사용할 수 있도록 허용
app.use(cors());

//DB 연결 정보
const dbConfig = {
    //user, password, connectString : 예약어
    user : 'react',
    password : 'react',
    connectString : 'localhost:1521/xe',
};

//OracleDB 연결 위한 connection과 SQL쿼리 실행 함수 생성
//SQL 쿼리, 쿼리로 인해 발생한 변수, 추가옵션을 지정해서 DB와 상호작용
//async를 이용해서 비동기(정적) 작업을 수행
async function runQuery(sql, binds = [], options = {}){
    let connection;

    //try{} catch(err){} finally{}
    //try : DB 연결 및 쿼리 실행
    //catch > 오류 발생시  console에 에러 출력
    //finally : DB를 닫고싶을 때, 연결을 닫을 수 있도록 설정

    try{
        //await : 비동기적으로 연결을 기다림
        connection = await oracledb.getConnection(dbConfig);

        //.execute를 사용해서 쿼리 실행
        //실행 결과는 result에 저장
        const result = await connection.execute(sql,binds,options);

        //쿼리 실행 결과에서 행 정보를 모두 반환
        //return result.row;

        //컬럼마다 속성(?) 지정
        return result.rows.map((row) => ({
            ID: row[0],
            TASK: row[1],
            MEMO: row[2],
            DONE: row[3],
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

//마지막으로 API를 사용해서 백엔드 연결 설정
//java의 controller와 동일한 역할
app.get("/", (request, response) => {
    response.send('Backend 연결 성공');
});

//API를 활용해서 DB Query에 작성한 내용 가져오기
app.get('/api/todos', async(request, response) => {
    const todos = await runQuery('SELECT * FROM todos');
    response.json(todos);
});

//연결한 PORT에 정상적으로 연결 되었는지 확인 위해 console 출력
app.listen(PORT, () => {
    console.log(`SERVER started : http://localhost:${PORT}`);
})