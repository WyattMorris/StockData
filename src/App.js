import React, { useState, useEffect, useContext } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Portfolio from "./pages/Portfolio";
import Register from "./pages/Register";
import NavBar from "./components/NavBar";
import AuthContext from "./context/auth-context";

const App = () => {
  const [displayArray, setDisplayArray] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const userContext = useContext(AuthContext);

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:8080/stockdata/", {
      method: "POST",
      body: JSON.stringify([
        "JNJ",
        "KO",
        "NFG",
        "MMM",
        "FRT",
        "BKH",
        "NWN",
        "LEG",
        "UVV",
        "MO",
      ]),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setDisplayArray(data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setError(true);
      });
  }, []);

  return (
    <>
      <Switch>
        <Route path="/portfolio">
          {userContext.isLoggedIn && <Portfolio />}
          {!userContext.isLoggedIn && <Redirect to="/register/signup" />}
        </Route>

        <Route path="/home" exact>
          <Homepage
            listdata={displayArray.sort((a, b) => b.value - a.value)}
            isLoading={isLoading}
            error={error}
          />
        </Route>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
        {!userContext.isLoggedIn && (
          <Route exact path="/register/:page">
            <NavBar buttons={true} />
            <Register />
          </Route>
        )}
        <Route path="*">
          <Redirect to="/home" />
        </Route>
      </Switch>
    </>
  );
};
export default App;
