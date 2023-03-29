import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Login from './components/Auth/Login'
import Registration from './components/Auth/Registration'
import { useEffect, createContext, useState } from 'react'
import Ratio from './pages/Ratio'
import { useAuth } from './hooks/auth.hook'
import { io } from 'socket.io-client'
import MyNavbar from './components/Navbar/MyNavbar'
import axios from 'axios'
export const AuthContext = createContext(null)

function App() {
  const socket = io.connect(process.env.REACT_APP_SOCKET_IP)
  // const socket = io()
  const { login, logout, token, userId, isAuth, userName } = useAuth()
  const [money, setMoney] = useState("")

  useEffect(() => {
    async function getMyMoney() {
      const response = await axios.get("/api/user/getMoney", {
        params: { userId },
        headers: {
          'Authorization': 'Bearer ' + token
      }
      })
      setMoney(response.data.userMoney)
    }
    if (userId) getMyMoney()
    
  }, [userId]);

  return (
    <AuthContext.Provider value={{
      login,
      logout,
      token,
      userId,
      isAuth,
      userName
    }}>
      <BrowserRouter>
        <div className="app">

          <MyNavbar money={money} />

          {
            !isAuth ?
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </Routes>
              :
              <Routes>
                <Route path="/" element={<Ratio money={money} setMoney={setMoney} socket={socket} />} />
                <Route path="/login" element={<Navigate to="/" />} />
                <Route path="/registration" element={<Navigate to="/" />} />
              </Routes>
          }
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
