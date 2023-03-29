import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../App';

const SetBets = ({ socket, money, setMoney, status, coef, usersBets }) => {
    const { userId, userName } = useContext(AuthContext)
    const [bet, setBet] = useState(5)

    const betHandler = () => {
        if (bet < 1 || bet > money) return
        
        socket.emit("setBet", {
            bet,
            userId,
            userName
        })
        setMoney(prev => prev - bet)
        setBet(5)
    }

    const withdrawHandler = () => {
        console.log(coef)

        socket.emit("withdraw", {
            userId,
            coef
        })
    }

    return (
        <div className="set-bet">
            <div className="inputBet">
                <input type="text" name="" id="" value={bet} onChange={(e) => setBet(Number(e.target.value.replace(/\D/, '')))} />
            </div>
            <div className="help-buttons">
                <div className="mybtn help-button" onClick={() => setBet(prev => prev - 5)}>-5</div>
                <div className="mybtn help-button" onClick={() => setBet(prev => prev - 1)}>-1</div>
                <div className="mybtn help-button" onClick={() => setBet(prev => prev + 1)}>+1</div>
                <div className="mybtn help-button" onClick={() => setBet(prev => prev + 5)}>+5</div>
                <div className="mybtn help-button" onClick={() => setBet(prev => prev * 2)}>x2</div>
            </div>
            <div className="button-bet">
                {
                    !status ?
                        <div className="mybtn btn-bet bg-green" onClick={betHandler}>Поставить</div>
                        :
                        usersBets.some((userBetInfo) => userBetInfo.userId === userId) &&
                        <div className="mybtn btn-bet bg-teal" onClick={withdrawHandler}>Вывести</div>
                }

            </div>
        </div>
    )
}

export default SetBets;
