import React,{useEffect,useState} from 'react';
import { Link } from 'react-router-dom';
import { message,Button } from 'antd';
import axios from 'axios';
import './index.css';


function Index() {
  const [detailData, setDetailData] = useState({});

  const GetQueryValue = (queryName) => {
    let query = decodeURI(window.location.search.substring(1));
    let vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
      let pair = vars[i].split("=");
      if (pair[0] === queryName) { return pair[1]; }
    }
    return null;
  }

  useEffect(() => {
    const id= GetQueryValue('id');
    getTableData(id);

  }, []);

  const getTableData = (id) => {
    axios({
      method: 'get',
      url: '/api/content/queryContentPage',
      data: {
        pageNo: 1,
        pageSize: 100,
      },
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 10000,
    }).then((res) => {
      if (res && res.data.status === 200) {
        const menu = res.data.data.list;
        setDetailData(menu.find(item => item.id === id * 1));
      } else {
        message.error(res && res.data.msg);
      }
    });
  }
console.log('detailData :>> ', detailData);
  return (
    // <div className="App">
    <div>
      <div className='detail' >
        <p className='text'>{detailData.content}</p>
        {/* <button className='detail_button'><Link style={{ textDecoration: 'none', color: 'red' }} to={`/recording`}>我有体会，要录音</Link></button> &nbsp;&nbsp;&nbsp;&nbsp;
        <button className='detail_button'><Link style={{ textDecoration: 'none', color: 'red' }} to="menu" >意未尽，继续听</Link></button> */}
      <div style={{textAlign:'center',marginTop:'10px'}}>
      <audio className='audio' src={`/api/file/getContentFile?fileName=${detailData.acc}`} autoplay="autoplay" controls="controls" ></audio>
      </div>
      <div style={{textAlign:'center',marginTop:'10px'}}>
      <Button type={"primary"}><Link to={`/recording`}>我有体会，要录音</Link></Button> &nbsp;&nbsp;&nbsp;&nbsp;
        <Button type={"primary"} ><Link to="menu" >意未尽，继续听</Link></Button>
      </div>
      </div>
    </div>
  );
}

export default Index;
