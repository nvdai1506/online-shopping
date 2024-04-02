import { Link } from "react-router-dom";
import classes from './MainNavigation.module.css';
import './MainNavigation.css';
import Search from "../header/action/Search";

import Logo from '../../images/NVD-192.png';
import Cart from "../header/action/Cart";
import User from "../header/action/User";
import Menu from "../header/menu/Menu";

function MainNavigation() {


    return (
        <header className={classes.header}>
            <div className={classes.logo_container}>
                <Link to='/'>
                    <img className={classes.logo} src={Logo} alt="NVD Logo" />
                </Link>
            </div>
            <div className={classes.menu}>
                <Menu />
            </div>
            <div className={classes.actions}>
                <Search />
                <Cart />
                <User />
            </div>
        </header>
    );

}

export default MainNavigation