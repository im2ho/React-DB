// User.js

import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function User() {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchUserData = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        'https://jsonplaceholder.typicode.com/users'
      );

      // 모든 사용자 데이터를 서버에 전송
      await axios.post('http://localhost:5000/api/saveUserData', {
        users: response.data,
      });

      // 가져온 사용자 데이터로 상태 업데이트
      setUserData(response.data);
    } catch (error) {
      console.error('유저 데이터를 가져오거나 저장하는 도중 오류 발생:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">유저 정보</h1>
      <div className="mb-3">
        <button className="btn btn-primary mt-2" onClick={searchUserData}>
          유저 정보 불러오기
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {userData.length > 0 && (
        <div>
          <h2>유저 목록</h2>
          <ul>
            {userData.map((user) => (
              <li key={user.id}>
                <p>이름: {user.name}</p>
                <p>이메일: {user.email}</p>
                <hr />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default User;