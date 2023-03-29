import React, { useContext, useEffect, useState } from 'react';
import { Button, Navbar, NavItem } from "react-materialize"
import { Link } from 'react-router-dom';
import { AuthContext } from '../../App';
import "./index.css"

const MyNavbar = ({ money }) => {
    const { logout, isAuth, userId, userName } = useContext(AuthContext)
    
    return (
        <Navbar
            className="black container-navbar"
            alignLinks="right"
            brand={<Link className="my-brand-logo" to="/">Crystal casino</Link>}
            id="mobile-nav"
            // menuIcon={<Icon>menu</Icon>}
            centerChildren
            options={{
                draggable: true,
                edge: 'left',
                inDuration: 250,
                onCloseEnd: null,
                onCloseStart: null,
                onOpenEnd: null,
                onOpenStart: null,
                outDuration: 200,
                preventScrolling: true
            }}>

            {
                isAuth ?
                    <div className="navbar-titles">
                        <div>
                            <div className="navbar-title username">{userName}</div>
                            <div className="navbar-title money">Crystal-coins: {parseFloat(money).toFixed(2)}</div>
                        </div>
                        <Button className="btn-info" onClick={logout}>Выйти</Button>
                    </div>
                    :
                    <>
                    </>
            }



        </Navbar >
    );
}

export default MyNavbar;
