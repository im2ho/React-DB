import React,{useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
/*
  useParams hook을 호출하면 path params의 값을 객체 형태로 반환해 준다.
  key : Route에서 설정한 path parameter의 이름
  value : path parameter의 실제로 전달 된 값
*/
const CafeDetail = () => {
    const params = useParams(); //param 객체 가져오기
    const cafeId = params.id; //params 객체 안에서 id프로퍼티의 value를 userId 변수에 할당
    
    const [cafe, setCafe] = useState({});

    useEffect(() => {
    fetch(`https://reqres.in/api/cafes/${cafeId}`) 
      .then((response) => response.json())
      .then((result) => setCafe(result.data));
     }, [cafeId]); // 4

  const { name, location, operating } = cafe;

  return (
    <section>
      <article>
        <p>
          <strong>{name}</strong>
        </p>
        <p>{location}</p>
        <p>{operating}</p>
      </article>
    </section>
  );
};

export default CafeDetail;