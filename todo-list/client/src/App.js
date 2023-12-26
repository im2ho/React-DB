import React, {useState, useEffect} from 'react';
import axios from "axios";

function App() {

  const [todos, setTodos] = useState([]);

  //server에서 Express를 활용해서 todos 데이터 가져오기
  useEffect(() => {
    axios.get('http://localhost:5002/api/todos')
    .then(response => {
      console.log("연결중..");
      setTodos(response.data);
    })
    .catch(err => {
      console.log("Error!", err);
    });
  },[setTodos]);

  return (
    <div style={{margin:"30px"}}>
      <h1>To Do List</h1>
        <table border={1} style={{textAlign:"center"}}>
          <thead>
            <th>no.</th>
            <th>할 일</th>
            <th>memo</th>
            <th>Check</th>
          </thead>
          <tbody>
            {todos.map(todo => (
              <tr key={todo.ID}>
                <td>{todo.ID}</td>
                <td>{todo.TASK}</td>
                <td>{todo.MEMO}</td>
                <td>{todo.DONE}</td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
}

export default App;