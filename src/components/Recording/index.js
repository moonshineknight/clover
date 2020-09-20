import React, { useRef, useEffect, useState } from 'react';
import Recorder from 'js-audio-recorder';
import { Input, message } from 'antd';
import { Link } from 'react-router-dom';

import axios from 'axios';
import './index.css';

function Recording () {
  const recorderTool = useRef(null);
  const drawRecorderId = useRef(null);
  const drawPlayId = useRef(null);

  const ctx = useRef(null);
  const pCtx = useRef(null);
  const oCanvas = useRef(null);
  const pCanvas = useRef(null);

  const [recordingInfo,setRecordingInfo] = useState({});
  const [recordingStatus, setRecordingStatus] = useState('');
  const [sendMessage, setSendMessage] = useState(false);
  const [userName, setUserName] = useState('');
  const [mail, setMail] = useState('');
  const [userNameTest, setUserNameTest] = useState(false);
  const [mailTest, setMailTest] = useState(false);

  useEffect(() => {
    init();
    oCanvas.current = document.getElementById('canvasRecording');
    ctx.current = oCanvas.current.getContext("2d");

    //播放波浪
    pCanvas.current = document.getElementById('canvasPlay');
    pCtx.current = pCanvas.current.getContext("2d");

  },[]);

  const init =() =>{
    let recorder = new Recorder({
      sampleBits: 16,                 // 采样位数，支持 8 或 16，默认是16
      sampleRate: 48000,              // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000
      numChannels: 1,                 // 声道，支持 1 或 2， 默认是1
      // compiling: false,(0.x版本中生效,1.x增加中)  // 是否边录边转换，默认是false
    });
    recorderTool.current = recorder;
    recorder.onprogress = (params) =>{
      setRecordingInfo(params);
    };

  }

  const drawRecord = () => {
    // 用requestAnimationFrame稳定60fps绘制
    drawRecorderId.current = requestAnimationFrame(drawRecord);
    // 实时获取音频大小数据
    let dataArray = recorderTool.current.getRecordAnalyseData(),
        bufferLength = dataArray.length;

    // 填充背景色
    ctx.current.fillStyle = 'rgb(200, 200, 0)';
    ctx.current.fillRect(0, 0, oCanvas.current.width, oCanvas.current.height);

    // 设定波形绘制颜色
    ctx.current.lineWidth = 3;
    ctx.current.strokeStyle = 'rgb(255, 0, 0)';
    ctx.current.beginPath();

    let sliceWidth = oCanvas.current.width * 1.0 / bufferLength, // 一个点占多少位置，共有bufferLength个点要绘制
            x = 0;          // 绘制点的x轴位置
    for (let i = 0; i < bufferLength; i++) {
      let v = dataArray[i] / 128.0;
      let y = v * oCanvas.current.height / 2;
      if (i === 0) {
        // 第一个点
        ctx.current.moveTo(x, y);
      } else {
        // 剩余的点
        ctx.current.lineTo(x, y);
      }
      // 依次平移，绘制所有点
      x += sliceWidth;
    }

    ctx.current.lineTo(oCanvas.current.width, oCanvas.current.height / 2);
    ctx.current.stroke();
  }

  const drawPlay = () => {
    // 用requestAnimationFrame稳定60fps绘制
    if(!recordingInfo.duration) {
      return;
    }
    drawPlayId.current = requestAnimationFrame(drawPlay);
    // 实时获取音频大小数据
    let dataArray = recorderTool.current.getPlayAnalyseData(),
        bufferLength = dataArray.length;

    // 填充背景色
    pCtx.current.fillStyle = 'rgb(200, 200, 0)';
    pCtx.current.fillRect(0, 0, pCanvas.current.width, pCanvas.current.height);

    // 设定波形绘制颜色
    pCtx.current.lineWidth = 3;
    pCtx.current.strokeStyle = 'rgb(255, 0, 0)';
    pCtx.current.beginPath();

    let sliceWidth = pCanvas.current.width * 1.0 / bufferLength, // 一个点占多少位置，共有bufferLength个点要绘制
            x = 0;          // 绘制点的x轴位置
    for (let i = 0; i < bufferLength; i++) {
      let v = dataArray[i] / 128.0;
      let y = v * pCanvas.current.height / 2;
      if (i === 0) {
        // 第一个点
        pCtx.current.moveTo(x, y);
      } else {
        // 剩余的点
        pCtx.current.lineTo(x, y);
      }
      // 依次平移，绘制所有点
      x += sliceWidth;
    }

    pCtx.current.lineTo(pCanvas.current.width, pCanvas.current.height / 2);
    pCtx.current.stroke();
  }

  // 开始录音
  const recorderStart = () => {
    if(!recorderTool.current) {
      init();
    }
    recorderTool.current.start().then(() => {
      setRecordingStatus('record');
      drawRecord();
    },(error)=>{
      console.log(`${error.name} : ${error.message}`)
    })
  }

  // 结束录音
  const recorderStop = () => {
    if(recorderTool.current) {
      recorderTool.current.stop();
    drawRecorderId.current && cancelAnimationFrame(drawRecorderId.current);
    drawRecorderId.current = null;
    // setRecordingStatus('end');
    }
  }

  // 录音暂停
  const recorderPause = () => {
    if(recorderTool.current) {
    recorderTool.current.pause();
    }
  }
  
  // 录音继续
  const recorderResume = () => {
    if(recorderTool.current) {
    recorderTool.current.resume();
    }
  }

  // 录音播放
  const recorderPlay = () => {
    if(recorderTool.current) {
    recorderTool.current.play();
    setRecordingStatus('play');
      drawPlay();//绘制波浪图
    }
  }
  
  // 暂停录音播放
  const recorderPausePlay = () => {
    if(recorderTool.current) {
    recorderTool.current.pausePlay()
    }
  }

  // 恢复录音播放
  const recorderResumePlay = () => {
    if(recorderTool.current) {
    recorderTool.current.resumePlay();
    drawPlay();//绘制波浪图
    }
  }

  // 停止录音播放
  const stopPlayRecorder = () => {
    if(recorderTool.current) {
    recorderTool.current.stopPlay();
    }
  }

  const destroyRecorder = () => {
    if(recorderTool.current){
      recorderTool.current.destroy().then(()=> {
        recorderTool.current = null;
        drawRecorderId.current && cancelAnimationFrame(drawRecorderId.current);
        drawPlayId.current && cancelAnimationFrame(drawPlayId.current);
        setRecordingInfo({});
        drawRecorderId.current = null;
        drawPlayId.current = null;
      });
    }
  }

  const getRandom =() => {
    let num = Math.floor(Math.random() * 10000000);
    return num;
  }

  const sendClick = () => {
      // if(!userName) {
      //   setUserNameTest(true);
      //   return;
      // }
      // const mailTest = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/;
      // ;                
      // if(!mailTest.test(mail) ) {
      //   setMailTest(true);
      //   return;
      // }
      let blob = recorderTool.current.getWAVBlob();

      // const blob = new Blob() // blob 对象
      let files = new window.File(
            [blob],
            getRandom(),
            { type: blob.type }
          );

      const formdata = new FormData();
      formdata.append('file',files);
      formdata.append('userName',userName);
      formdata.append('mail',mail);
      axios({
        method: 'post',
        url: '/api/uploadTape/sendMail',
        data: formdata,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 100000,
        // ...//其他相关配置
      }).then((res) => {
        if(res && res.data.status === 200){
          setSendMessage(false);
          message.success('发送成功');
        }else{
          message.warning(res.data.msg);
        };
      });
      
    
  }

  return (
    <div className="App">
    <div style={{marginTop:'130px',textAlign:"center"}}>
    <button className="recording_button" onClick ={recorderStart}>开始录音</button>
    <button className="recording_button" onClick ={recorderPause}>暂停</button>
    <button className="recording_button" onClick ={recorderResume}>继续</button> 
    <button className="recording_button" onClick ={recorderStop}>结束录音</button> 
    <button className="recording_button" onClick ={destroyRecorder}> 放弃重录</button> 

    <button className='recording_button'>
          <Link style={{color:'red',textDecoration:'none'}} to="/menu">继续聆听</Link>
        </button>
    </div>
    <div style={{padding:'20px 10px'}} >
        <div style={{width:'25%',height:'150px', verticalAlign:'middle', display:'inline-block',color:'#ff0',textAlign:'center'}}>
          <h1 style={{color:'#ff0',fontSize:"40px"}}>{(recordingInfo.duration && recordingInfo.duration.toFixed(3)) || 0}</h1>
          <h5 style={{color:'#ff0',fontSize:"16px"}}>录音时长（秒）</h5>
        </div>
        <div style={{width:'25%',display:'inline-block',height:'150px', verticalAlign:'middle',color:'#ff0',textAlign:'center'}}>
          <h1 style={{color:'#ff0',fontSize:"40px"}}>{(recordingInfo.vol && recordingInfo.vol && recordingInfo.vol.toFixed(2)) || 0 }</h1>
          <h5 style={{color:'#ff0',fontSize:"16px"}}>当前录音音量百分比(%)）</h5>
        </div>
        <div style={{width:'25%',display:'inline-block',height:'150px', verticalAlign:'middle',color:'#ff0',textAlign:'center'}}>
        <canvas style={{display : recordingStatus === 'record' ? 'block': "none"}} width="300" height="150" id="canvasRecording"></canvas>
        <canvas style={{display : recordingStatus === 'play' ? 'block': "none"}} width="300" height="150" id="canvasPlay"></canvas> 
        </div>
        
    </div>
    <div style={{marginTop:'10px',textAlign:"center"}}>
    <button className="recording_button" onClick ={recorderPlay}>播放</button>
    <button className="recording_button" onClick ={recorderPausePlay}>暂停</button>
    <button className="recording_button" onClick ={recorderResumePlay}>继续</button> 
    <button className="recording_button" onClick ={stopPlayRecorder}> 结束</button> 
    <button className="recording_button" onClick ={()=> setSendMessage(true)}> 发送邮件</button> 

    </div>

    {sendMessage ? <div style={{marginTop:'20px',textAlign:"center"}}>
      <div>
      <div style={{ display:'inline-block',width:'80px',textAlign:'right',marginRight:'10px',color:'#ff0'}}>姓名:</div>
      <div style={{ display:'inline-block',width:'180px',height:'25px'}}> 
      <Input style={{width:'100%',height:'100%'}} onChange={(e)=> { setUserName(e.target.value);setUserNameTest(false)}} /> 
      </div>
      </div>
      { userNameTest ? <div style={{ width:'100%',marginTop:'10px',textAlign:'center',color:'#ff0'}}> 
        姓名不能为空
      </div> : null}
      <div style={{marginTop: !userNameTest ? '32px' : 0 }}>
      <div style={{ display:'inline-block',width:'80px',textAlign:'right',marginRight:'10px',color:'#ff0'}}>邮箱:</div>
      <div style={{ display:'inline-block',width:'180px',height:'25px'}}> 
      <Input style={{width:'100%',height:'100%'}} onChange={(e)=> { setMail(e.target.value);setMailTest(false);}} /> 
      </div>
      </div>
      { mailTest ? <div style={{ width:'100%',marginTop:'10px',textAlign:'center',color:'#ff0'}}> 
        邮箱格式不正确
      </div> : null}
      <div style={{  marginTop: !mailTest ? '32px' : 0}}>
        <button className='send' onClick={() => sendClick() }> 发送</button>
      </div>
    </div> : null }
    </div>
  );
}

export default Recording;
