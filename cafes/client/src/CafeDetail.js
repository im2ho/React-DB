import React from 'react';
import { useParams } from 'react-router-dom';

const CafeDetail = () => {
    const {id} = useParams();
    return (
    <div>
      <p>{id}번 Cafe</p>
    </div>
  );
};

export default CafeDetail;