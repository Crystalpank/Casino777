import { useCallback, useState, useEffect } from "react"


export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [userId, setUserId] = useState(null)
    const [isAuth, setIsAuth] = useState(false)
    const [userName, setUserName] = useState(null)

    const login = useCallback(({ jwtToken, id, userName }) => {
        setToken(jwtToken)
        setUserId(id)
        setIsAuth(true)
        setUserName(userName)
        localStorage.setItem("crystalCasino_userData", JSON.stringify({
            id, jwtToken, userName
        }))
    }, [])

    const logout = () => {
        setToken(null)
        setUserId(null)
        setIsAuth(false)
        setUserName(null)
        localStorage.removeItem("crystalCasino_userData")
    }

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("crystalCasino_userData"))
        if (data && data.jwtToken) {
            login({jwtToken: data.jwtToken, id: data.id, userName: data.userName})
            // setIsAuth(true)
        }
    }, [login]);

    return { login, logout, token, userId, isAuth, userName }
}