import React, { useState, useEffect} from 'react';
import { Table, Row, Col, Button, Modal, Input, Upload, message } from 'antd';
import axios from 'axios';
import './index.css';
import TextArea from 'antd/lib/input/TextArea';
import { UploadOutlined } from '@ant-design/icons';

function Index() {
  const [tableData, setTableData] = useState([]);
  const [editVisible, setEditVisible] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    getTableData();

  }, []);

  const getTableData =() =>{
    axios({
      method: 'get',
      url: '/api/content/queryContentPage',
      data: {
        pageNo:1,
        pageSize:100,
      },
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 10000,
    }).then((res) => {
      if (res && res.data.status === 200) {
        setTableData(res.data.data.list);
      } else {
        message.error(res && res.data.msg);
      }
    });
  }

  const deleteContent = (id) => {
    axios({
      method: 'get',
      url: '/api/content/deleteContent',
      params: {
        id,
      },
      // ...//其他相关配置
    }).then((res) => {
      if (res && res.data.status === 200) {
        message.success('删除成功');
        getTableData();
      }
    });

  }

  const updateContent = (record) => {
    const { title, content, id } = record;
    console.log('content :>> ', content);
    setEditVisible(true);
    setModalContent({
      title,
      content,
      id,
    });
  }

  const addContent = (id) => {
    setEditVisible(true);
    setModalContent({});
  }

  const confirm = () => {
    if (!modalContent.title && !modalContent.id) {
      message.warning('请填写标题');
      return;
    }
    if (!modalContent.content && !modalContent.id) {
      message.warning('请填写文本内容');
      return;
    }

    if (!fileList.length && !modalContent.id ) {
      message.warning('选择文件');
      return;
    }
    const formdata = new FormData();
    formdata.append('title', modalContent.title);
    formdata.append('content', modalContent.content);
  if(fileList.length){
    console.log('fileList11111',fileList);
    formdata.append('file', fileList[0]);
  }

  if(modalContent.id){
    formdata.append('id', modalContent.id);
  }
  let url = '/api/content/addContent';
  if(modalContent.id){
    url= '/api/content/updateContent';
  }
    axios({
      method: 'post',
      url,
      data: formdata,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 10000,
    }).then((res) => {
      if (res && res.data.status === 200) {
        if(modalContent.id){
          message.success('修改成功');
        }else{
          message.success('添加成功');
        }

        setEditVisible(false);
        setModalContent({});
        setFileList([]);
        getTableData();
      } else {
        message.error(res && res.data.msg);
      }
    });
  }
  const onCancel = () => {
    setEditVisible(false);
    setModalContent({});
  }

  const props = {
    onRemove: file => {
      setFileList(() => {
        const index = fileList.indexOf(file);
        const newFileList = fileList.slice();
        newFileList.splice(index, 1);
        console.log('newFileList :>> ', newFileList);
        return newFileList;
      });
    },
    beforeUpload: file => {
      setFileList(() => [...fileList, file]);
      return false;
    },
    fileList,
  };

  const updateModalContent = (key, value) => {
    setModalContent({
      ...modalContent,
      [key]: value,
    })
  }

  const columns = [
    {
      title: '标题',        //菜单内容
      dataIndex: 'title',   //在数据中对应的属性
      key: 'title',   //key
      width:300,
    },
    {
      title: '内容',
      dataIndex: 'content',   //在数据中对应的属性
      key: 'content',
      width:600,
      render:(text,record) => {

      }
    },
    {
      title: '操作',
      dataIndex: 'id',   //在数据中对应的属性
      key: 'id',   //key
      render: (text, record) => (
        <span>
          <Button  type='primary' onClick={() => updateContent(record)}> 修改</Button> &nbsp;&nbsp;
          <Button  type='primary' onClick={() => deleteContent(record.id)}> 删除</Button>
        </span>
      ),
    },
  ];


  return (
    <div style={{ padding: '20px 30px' }}>
      <Row>
        <Col span={1} >
          <Button type='primary' onClick={() => addContent()} >新增</Button>
        </Col>
      </Row>
      <br />
      <Row>
        <Col span={24} >
          <Table rowKey='id' dataSource={tableData} columns={columns} />
        </Col>
      </Row>
      <Modal
        width={600}
        title="编辑"
        visible={editVisible}
        onOk={confirm}
        onCancel={onCancel}
      >
        <div style={{ textAlign: "center" }}>
          <div>
            <div style={{ display: 'inline-block', width: '80px' }}>标题:</div>
            <div style={{ display: 'inline-block', width: '420px', height: '25px' }}>
              <Input style={{ width: '100%', height: '100%' }} value={modalContent.title} onChange={(e) => { updateModalContent('title', e.target.value) }} />
            </div>
          </div>

          <div style={{ marginTop: '10px' }}>
            <div style={{ display: 'inline-block', width: '80px' }}>内容:</div>
            <div style={{ display: 'inline-block', width: '420px' }}>
              <TextArea autoSize={{ minRows: 10, maxRows: 18 }}
                style={{ width: '100%', height: '100%' }}
                value={modalContent.content}
                onChange={(e) => { updateModalContent('content', e.target.value) }} />
            </div>
          </div>

          <div style={{ marginTop: '10px' }}>
            <div style={{ display: 'inline-block', width: '80px' }}>文件:</div>
            <div style={{ display: 'inline-block', width: '420px' }}>
              <Upload {...props}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </div>
          </div>


        </div>
      </Modal>
    </div>
  );
}

export default Index;
