import React, { useEffect, useState, useContext } from 'react';
import Coef from '../components/Ratio/Coef';
import Timer from '../components/Ratio/Timer';
import SetBets from '../components/Ratio/SetBets';
import PreviousResult from '../components/Ratio/PreviousResult';
import "../components/Ratio/ratio.css"
import axios from 'axios';
import { AuthContext } from '../App';

const Ratio = ({ socket, money, setMoney }) => {
    const [coef, setCoef] = useState("")
    const [timer, setTimer] = useState("")
    const [prevCoefs, setPrevCoefs] = useState([])
    const [usersBets, setUsersBets] = useState([])
    const [status, setStatus] = useState("")
    const { token } = useContext(AuthContext)

    useEffect(() => {
        async function fetchCoefs() {
            const response = await axios.get('/api/casino/getPreviousCoefs', {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
            setPrevCoefs(response.data.previousCoefs.map(el => el.coef))
        }
        fetchCoefs()
    }, [])

    useEffect(() => {
        let interval = setInterval(() => {
            socket.emit("getData", 1)
        }, 63)

        socket.on("ratio", (data) => {
            setCoef(data.ratio)
            setTimer(data.timer)
            setStatus(data.status)
        })
        socket.on("usersBets", (data) => {
            setUsersBets(data)
        })
        socket.emit("getUsersBets", 1)
        return () => {
            clearInterval(interval)
            socket.off("ratio")
            socket.off("usersBets")
        }
    }, [])

    useEffect(() => {
        if (timer === 10) {
            socket.emit("getCoef", 1)
        }
    }, [timer, socket])

    useEffect(() => {
        socket.on("getReward", (data) => {
            setMoney(prev => prev + data)
            console.log("win", data)
        })
        return () => {
            socket.off("getReward")
        }
    }, [socket, setMoney])

    // useEffect(() => {
    //     socket.on("userBet", (data) => {
    //         console.log(data)
    //         setUsersBets([...usersBets, data])
    //     })
    //     return () => {
    //         socket.off("userBet")
    //     }
    // }, [socket, usersBets])

    useEffect(() => {
        socket.on("lastCoef", (data) => {
            if (prevCoefs.length > 9) {
                --prevCoefs.length
            }
            setPrevCoefs([data.lastCoef, ...prevCoefs])
            setUsersBets([])
        })
        return () => {
            socket.off("lastCoef")
        }
    }, [socket, prevCoefs])

    const setColorPrevCoef = (coef) => {
        if (coef >= 100) {
            return "is-gold"
        } else if (coef >= 50) {
            return "is-blue"
        } else if (coef >= 2) {
            return "is-green"
        } else if (coef > 1.2) {
            return "is-grey"
        } else {
            return "is-red"
        }
    }

    return (
        <div className="container">
            <div className="previous-coefs-block">
                <div className="previous-coefs">
                    {
                        prevCoefs.map((coef, i) => <PreviousResult key={i} setColorPrevCoef={setColorPrevCoef} coef={coef} />)
                    }
                </div>
            </div>

            <div className="ratio-block">
                {
                    status ? <Coef coef={coef} /> : <Timer timer={timer} />
                }
                <SetBets socket={socket} money={money} setMoney={setMoney} status={status} coef={coef} usersBets={usersBets} />
            </div>
            <div className="users-bets-table">

                {
                    usersBets.map((userBet, i) => <div className="user-bet" key={i}>{userBet.userName} - {userBet.bet}</div>)
                }

            </div>
        </div>
    );
}

export default Ratio;
