import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import classes from './MainNavigation.module.css';

import AuthContext from "../../context/auth-context";


function MainNavigation() {
    const navigate = useNavigate();
    const location = useLocation();

    const authCtx = useContext(AuthContext);
    const isLoggedIn = authCtx.isLoggedIn;

    const logoutHandler = () => {
        authCtx.logout();
        navigate('/login');
    }
    const onClickLogoHandler = () => {
        navigate('/');
    }
    return (
        <header className={classes.headerNav}>
            <div className={classes.logo} onClick={onClickLogoHandler}>Admin</div>
            <nav>
                <ul>
                    {isLoggedIn &&
                        <li>
                            <Link to='/dashboard' className={classes[`${(location.pathname === '/' || location.pathname === '/dashboard') ? 'active' : ''}`]}>Dashboard</Link>
                        </li>
                    }
                    {isLoggedIn &&
                        <li>
                            <Link to='/catalog' className={classes[`${location.pathname === '/catalog' ? 'active' : ''}`]}>Catalog</Link>
                        </li>
                    }
                    {isLoggedIn &&
                        <li>
                            <Link to='/product' className={classes[`${location.pathname === '/product' ? 'active' : ''}`]}>Product</Link>
                        </li>
                    }
                    {isLoggedIn &&
                        <li>
                            <Link to='/order' className={classes[`${location.pathname === '/order' ? 'active' : ''}`]}>Order</Link>
                        </li>
                    }
                    {!isLoggedIn &&
                        <li>
                            <Link className={classes[`${location.pathname === '/login' ? 'active' : ''}`]}>Login</Link>
                        </li>
                    }
                    {isLoggedIn &&
                        <li onClick={logoutHandler}>
                            Logout
                        </li>
                    }
                </ul>
            </nav>
        </header>
    );

}

export default MainNavigation