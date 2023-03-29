import React from 'react';
import { Link } from 'react-router-dom';
import axios from "axios"
import { useState, useContext } from 'react';
import { AuthContext } from '../../App';
import { Row, Col, TextInput, Button } from 'react-materialize'
import "./index.css"

const Login = () => {
    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    const { login } = useContext(AuthContext);
    const loginHandler = async (e) => {
        e.preventDefault()
        try {
            if (!(form.email && form.password)) {
                // return
            }
            await axios.post("/api/auth/login", {
                ...form
            }).then(response => login({jwtToken: response.data.token, id: response.data.user._id, userName: response.data.userName}))
        } catch (e) {
            console.log(e)
        }
    }
    return (
        <div className="container">
            <div className="auth-page">
                <h3 className="teal-text">Авторизация</h3>
                <form className="form form-login" onSubmit={loginHandler}>
                    <Col
                        s={12}>
                        <TextInput
                            email={true}
                            error="error-email"
                            className="auth-input"
                            label="Почта"
                            validate
                            onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </Col>
                    <Col
                        s={12}>
                        <TextInput
                            type="password"
                            label="Пароль"
                            validate
                            onChange={(e) => setForm({ ...form, password: e.target.value })} />
                    </Col>
                    <Row>
                        <Button
                            className="green"
                            type="submit"
                            waves="light">
                            Войти
                        </Button>
                        <Link to="/registration" className="btn-outline btn-reg teal-text">Нет аккаунта?</Link>
                    </Row>
                </form>
            </div>
        </div >
    );
}

export default Login;
