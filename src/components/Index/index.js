import React from 'react';
import { Link } from 'react-router-dom';
// import { Button } from 'antd';

import './index.css';


function Index () {
  return (
    <div className="App">
      <div className="title"> 欢声习语</div>
        <button className='start'>
          <Link style={{color:'red',textDecoration:'none'}} to="/menu">开始</Link>
        </button>
    </div>
  );
}

export default Index;
