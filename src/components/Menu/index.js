import React,{useEffect,useState,message} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { List, Divider } from 'antd';

import './index.css';

function Index () {
  const [menuData, setMenuData] = useState([]);

  useEffect(() => {
    getMenuData();
  }, []);

  const getMenuData =() =>{
    axios({
      method: 'get',
      url: '/api/content/queryContentPage',
      data: {
        pageNo:1,
        pageSize:1000,
      },
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 10000,
    }).then((res) => {
      if (res && res.data.status === 200) {
        const data  = res.data.data.list;
        setMenuData(data.map((item) => {
          const {title,id} = item;
          return {
            title,
            id,
          };
        }));
      } else {
        message.error(res && res.data.msg);
      }
    });
  }

  console.log('menuData :>> ', menuData);
  return (
    <div>
      {/* <div className="list"> */}
      <div>
    {/* {
      menuData.map((menu,index) => {
        return (
          <Link key={index} style={{textDecoration:'none'}} to={`/detail?id=${menu.id}`}>
            <h3 style={{color:'#ff0'}} key={index}>{menu.title}</h3>
          </Link>
        )
      })
    } */}

<Divider orientation="left">习语列表</Divider>
    <List
      bordered
      dataSource={menuData}
      renderItem={item => (
        <List.Item>
              <List.Item.Meta
          // avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
          title={
            <Link style={{textDecoration:'none'}} to={`/detail?id=${item.id}`}>
            {item.title}
          </Link>
        }
          // description="Ant Design, a design language for background applications, is refined by Ant UED Team"
        />
          
        </List.Item>
      )}
    />

      </div>
        
    </div>
  );
}

export default Index;
