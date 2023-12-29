import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Link, Routes, Route, BrowserRouter } from "react-router-dom";
import CafeDetail from './CafeDetail';

function App() {

  const [cafes, setCafes] = useState([]);

  //null값으로 useState 선택해서 상세보는 selectTOdo, setSelectTodo
  const [details, setDetails] = useState(null);

  //버튼 클릭시 보여줄 코드
  const cafeDetail = (cafe) => {
    //선택된 카페를 어쩌구
    setDetails(cafe);
  }

  //server에서 Express를 활용해서 cafes 데이터 가져오기
  useEffect(() => {
    axios.get('http://localhost:5003/cafes-list')
    .then(response => {
      setCafes(response.data);
    })
    .catch(err => {
      console.log("error", err);
    });
  },[setCafes])

  return (
    <BrowserRouter>
    <div style={{marginLeft : "50px"}}>
      <h1>Cafes</h1>
      <table border={1} style={{textAlign:"center"}}>
        <thead>
          <th>Id</th>
          <th>주소</th>
          <th>상호</th>
          <th>운영시간</th>
          <th>상세보기</th>
        </thead>
        <tbody>
          {cafes.map(cafe => (
            <tr key={cafe.ID} cafe={cafe}>
              <td>{cafe.ID}</td>
              <td>{cafe.LOCATION}</td>
              <td>{cafe.NAME}</td>
              <td>{cafe.OPERATING}</td>
              <td>
                <button onClick={()=>cafeDetail(cafe)}>Click</button>
              </td>
              <td>
                <Link to={`/detail/${cafe.ID}`}>Click</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {details && (
        <div>
          <h2>상세 정보</h2>
          <p>Id : {details.ID}</p>
          <p>NAME : {details.NAME}</p>
        </div>
      )}
      <Routes>
        {/*path parameter : id*/}
        <Route path="/detail/:id" element={<CafeDetail />} />
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
