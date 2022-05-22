import styles from "../styles/NavBar.module.css";
import React, { useContext } from "react";
import Button from "@mui/material/Button";
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../context/auth-context";

const NavBar = () => {
  const userContext = useContext(AuthContext);
  const isLoggedIn = userContext.isLoggedIn;
  const location = useLocation();

  const portfolio = location.pathname === "/portfolio";

  return (
    <nav>
      <Link to="/home">
        {userContext.isLoggedIn && (
          <h1>StockData - Welcome {userContext.firstName}</h1>
        )}
        {!userContext.isLoggedIn && <h1>StockDa</h1>}
      </Link>
      <div className={styles.button}>
        {!isLoggedIn && (
          <Link to="/register/login">
            <Button
              type="button"
              variant="contained"
              size="large"
              className={styles.left}
            >
              Log In
            </Button>
          </Link>
        )}
        {!isLoggedIn && (
          <Link to="/register/signup">
            <Button
              type="button"
              variant="contained"
              size="large"
              className={styles.right}
            >
              Sign Up
            </Button>
          </Link>
        )}
        {isLoggedIn && !portfolio && (
          <Link to="/portfolio">
            <Button
              type="button"
              variant="contained"
              size="large"
              className={styles.left}
            >
              My Portfolio
            </Button>
          </Link>
        )}
        {isLoggedIn && (
          <Link to="/home">
            <Button
              type="button"
              variant="contained"
              size="large"
              className={styles.right}
              onClick={userContext.logout}
            >
              Log Out
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
