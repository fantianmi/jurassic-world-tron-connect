import { React, useState, useEffect } from 'react';
import { Layout,Modal,Card,Button,Spin, Alert} from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import Web3erke from './components/Web3erke';
import Web3jura from './components/Web3jura';
import { useQueryParam, NumberParam, StringParam } from 'use-query-params';
import MD5 from 'crypto-js/md5'
import logo from './logo-small.png';

const { Header, Footer, Sider, Content } = Layout;
const { confirm,info } = Modal;

// const contract;
// const contractERKEAddress = "TMA9ma43rvdEZHygpDResKuQfuE2iide23"

const recipient = "T9yD14Nj9j7xAB4dbGeiX9h8unkKLxmGkn"
// 密钥：menglongdaluandou
const key = "menglongdaluandou"


function EggsBuy() {
    useEffect(() => {
        const interval = setInterval(async () => {
            watchTransaction();
            //wallet checking interval 2sec
        }, 2000);
        return () => {
            clearInterval(interval);
        };
    });

    const [buttonText,setButtonText] = useState('Pay')
    const [redirectUrl,setRedirectUrl] = useState('')
    const [errorMessage,setErrorMessage]= useState('')
    const [txid,setTxid] = useState('')
    const [notifyPrice,setNotifyPrice] = useState(0)
    const [notifySymbol,setNotifySymbol] = useState(0)

    // console.log(`notifyprice=${notifyPrice},notifySymbol=${notifySymbol}`)
    
    let price = useQueryParam('price', NumberParam);
    let symbol = useQueryParam('symbol', NumberParam);
    
    const [order,setOrder] = useQueryParam('order', StringParam);

    if(typeof(order) === 'undefined' || typeof(price) === 'undefined' || typeof(symbol) === 'undefined'){
        // console.log("params error")
        return;
    }
    price = parseFloat(price)
    symbol = parseInt(symbol)

    

    const pageSymbol = symbol===1?'ERKE':"JURA"

    const pay = async()=>{
        

        // console.log(`after notifyprice=${notifyPrice},notifySymbol=${notifySymbol}`)
        if(buttonText === 'SUCCESS, RETURN TO THE GAME'){
            window.location.href = redirectUrl;
            return;
        }
        if(buttonText !== 'Pay'){
            return;
        }
        setButtonText('Transfer Processing...')
        doTransfer()
    }

    const doTransfer=()=>{
        
        if(symbol === 2){
            
            Web3jura.init(res => {
                // console.log(res)
                const amount = price * 100000000
                Web3jura.transfer(recipient,amount,res=>{
                    if(res){
                        let txid = res;
                        setTxid(txid);
                    }else{
                        setErrorMessage('ERROR: transaction fail, please check')
                        setButtonText('Pay')
                    }
                    
                },err=>{

                    setErrorMessage(`ERROR: transaction fail, please check ${JSON.stringify(err)}`)
                    setButtonText('Pay')
                })
            })

        }else if(symbol === 1){
        
            Web3erke.init(res => {
                // console.log(res)
                const amount = price * 1000000;
                Web3erke.transfer(recipient,amount,res=>{
                    if(res){
                        let txid = res;
                        setTxid(txid);
                    }else{
                        setErrorMessage('transaction fail, please check')
                        setButtonText('Pay')
                    }
                    
                },err=>{
                    setErrorMessage('transaction fail, please check')
                    setButtonText('Pay')
                })
            
            })
        }else{
            pageSymbol = 'UNKNOWN'
            setButtonText('Pay')
        }
        
    }
    const makesign =(_order,_amount,_symbol)=>{
        let string = `${_order}${key}${_amount}${_symbol}`;
        // console.log(`sign str:${string}`)
        return MD5(string)
    }

    const notifySuccess = async()=>{
        const result = makesign(order,notifyPrice,notifySymbol)
        // console.log(`result str:${result}`)
        const data = {
            order:order,
            sign:`${result}`
        }
        
        
        const url = `http://home.jurassic.one/api/index/callback`   
        // console.log(JSON.stringify(data))
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

            if(responsedata.code === '1'){
                setRedirectUrl(responsedata.url_th);
                setNotifyPrice(0)
                setNotifySymbol(0)
                confirm({
                    title: 'SUCCESS BUY EGGS',
                    icon: <CheckOutlined />,
                    content: 'You have successfully purchased dragon eggs. Now you can click the button below to return to the game',
                    okText: 'RETURN TO THE GAME',
                    okType: 'primary',
                    cancelText: 'CANCEL',
                    onOk() {
                      window.location.href = responsedata.url_th
                    },
                    onCancel() {
                    //   console.log('Cancel');
                    },
                });
                // window.location.href = responsedata.url_th;
            }
            // console.log(responsedata)
        } catch (error) {
            console.error('Unable to fetch data:', error)
        }
    }

    let loadingArea;


    if (buttonText !== 'Pay' && buttonText !== 'SUCCESS, RETURN TO THE GAME') {
        loadingArea = <Spin tip="please wait...">
        <Alert
            message="Transfer processing"
            description="Do not close this window. You may not be able to purchase successfully after closing"
            type="info"
            />
        </Spin>;
    } else if(buttonText === 'SUCCESS, RETURN TO THE GAME'){
        loadingArea = <Alert message="You have successfully purchased dragon eggs. Now you can click the button below to return to the game" type="success" />;
    }else {
        loadingArea = '';
    }

    let errMessageBox;
    if(errorMessage !== ''){
        errMessageBox = <Alert message={errorMessage} type="error" />;
    }else{
        errMessageBox = '';
    }

    const watchTransaction = async()=>{
        if(notifySymbol !== 0 && notifyPrice !== 0){
            notifySuccess();
        }
        if(txid === ''){
            return;
        }
        

        // console.log(txid)

        window.tronWeb.trx.getConfirmedTransaction(txid).then(res => {
            // console.log(res)
            if (res.ret[0].contractRet === "SUCCESS") {
                setButtonText('SUCCESS, RETURN TO THE GAME')
                setTxid('')
                setNotifyPrice(price)
                setNotifySymbol(symbol)
            } else {
                setErrorMessage('ERROR: transaction fail, please check')
                setButtonText('Pay')
                setTxid('')
            }
            }).catch(err => {
                // setErrorMessage(`ERROR: transaction fail, please check, ${JSON.stringify(err)}`)
                // setButtonText('Pay')
                // console.log(err)
        });
        
    }

    

    return (
        <Layout style={{backgroundColor:'#FFF'}}>
        <Content>
        <p style={{textAlign:'center'}}><img
          src={logo} style={{width:'50%',margin:'15px auto',maxWidth:'200px'}} alt="JURASSIC WORLD"/></p>
            <div className='container'>
                <Card title="Buy Eggs" style={{margin: '15px auto',maxWidth:'300px'}}>
                    <p>No#{order}</p>
                    <p>Price: {price} {pageSymbol}</p>
                    {loadingArea}
                    {errMessageBox}
                    <p style={{marginTop:'10px'}}><Button type="primary" block onClick={pay}>{buttonText}</Button></p>
                </Card>
            </div>
            
        </Content>
        <Footer style={{textAlign:'center'}} >JURASSIC WORLD</Footer>
        </Layout>
    );
}

export default EggsBuy;
