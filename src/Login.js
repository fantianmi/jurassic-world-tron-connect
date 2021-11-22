import { React, useState, useEffect } from 'react';
import logo from './logo.png';
import { Modal} from 'antd';
import { CheckOutlined } from '@ant-design/icons';




const { confirm,info } = Modal;

let isSendLoginData = false;

function Login() {
  //
  // const [modal, contextHolder] = Modal.useModal();
  const sendLoginDataToServer = async(address)=>{
    // console.log(window.tronWeb.ready)
    if(!isSendLoginData){
      isSendLoginData = true;
      if(!address){
        info({
          title:"Failed to connect Wallet",
          content:"Please confirm whether the wallet is installed and click authorize"
        });
        return;
      }

      const url = "http://home.jurassic.one/api/login/login"
      const data = {
        openid:address,
        username:address
      }

      try {
        const response = await fetch(url, 
        {
          body: JSON.stringify(data), // must match 'Content-Type' header
          headers: {
            'content-type': 'application/json'
          },
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
        });

        const responsedata = await response.json()
        console.log(responsedata)
        if(responsedata.code === '1'){
          window.location.href = `http://game.jurassic.one?token=${responsedata.data}`
          // confirm({
          //   title: 'Wallet connected',
          //   icon: <CheckOutlined />,
          //   content: 'Wallet authorization succeeded',
          //   okText: 'Enter the game',
          //   okType: 'primary',
          //   cancelText: 'cancel',
          //   onOk() {
              
          //   },
          //   onCancel() {
          //     console.log('Cancel');
          //   },
          // });
        }else{
          info({
            title:"Game registration failed",
            content:"Please contact customer service for handling"
          });
        }
        
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
      console.log("send login data:",address);
    }
    
    
  }

  const [myMessage, setMyMessage] = useState(<h3> LOADING.. </h3>);
  const [myDetails, setMyDetails] = useState({
    name: 'none',
    address: 'none',
    balance: 0,
    frozenBalance: 0,
    network: 'none',
    link: 'false',
  });

  const getWalletDetails = async () => {
    if (window.tronWeb) {
      sendLoginDataToServer(window.tronWeb.defaultAddress.base58);
    } else {
      //wallet is not detected at all
      setMyMessage(<h3>WALLET NOT DETECTED</h3>);
    }
  };
  // getWalletDetails();
  useEffect(() => {
    const interval = setInterval(async () => {
      getWalletDetails();
      //wallet checking interval 2sec
    }, 2000);
    return () => {
      clearInterval(interval);
    };
  });

  return (
    <div>
        
        <div style={{textAlign:'center',display:'block'}}>
        <img
          src={logo} style={{width:'50%',margin:'30px auto',maxWidth:'300px'}} alt="JURASSIC WORLD"/>
        </div>
        <h4 style={{color:'#666',textAlign:'center'}}>JURASSIC WORLD & CONNECT WALLET</h4>
    </div>
  );
}

export default Login;
