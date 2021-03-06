import { React, useState, createContext, useEffect } from "react";
import jwt_decode from "jwt-decode";

let logoutTimer;

const AuthContext = createContext({
  //Setting a default context, mosly for IDE autocomplete.
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
  tickerList: [],
  firstName: "",
  base_url: "",
});

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem("token");
  const storedExpirationDate = localStorage.getItem("expiration");

  const remainingTime = storedExpirationDate - new Date().getTime();
  if (remainingTime <= 60000) {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    return null;
  }
  return {
    token: storedToken,
    duration: remainingTime,
  };
};

export const AuthProvider = (props) => {
  const tokenData = retrieveStoredToken();
  let initialToken = null;
  let storedName = null;
  if (tokenData) {
    initialToken = tokenData.token;
    storedName = localStorage.getItem("firstName");
  }
  const [token, setToken] = useState(initialToken);
  const [firstName, setFirstName] = useState(storedName);

  useEffect(() => {
    if (token !== null) {
      const url =
        "https://ec2-18-191-253-70.us-east-2.compute.amazonaws.com:8443/stockdata/portfolio/stocks";
      fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error("Unable to Save");
          }
        })
        .then((data) => {
          const newData = data.map((object) => {
            return { ...object, id: object.ticker };
          });
          setTickerList(newData);
        })
        .catch(() => {
          setTickerList([]);
        });
    }
  }, [token]);

  const [tickerList, setTickerList] = useState([]);

  //Converting truthy/falsy value to boolean
  const userIsLoggedIn = !!token;

  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("firstName");
    localStorage.removeItem("expiration");
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  };

  const loginHandler = (token) => {
    setToken(token);
    localStorage.setItem("token", token);

    //Extract data from the token
    let decoded = jwt_decode(token);

    setFirstName(decoded.firstName);
    localStorage.setItem("firstName", decoded.firstName);

    localStorage.setItem("expiration", decoded.exp);
    const remainingTime = decoded.exp - new Date().getTime();
    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };

  const addTickerHandler = (data) => {
    setTickerList((prevState) => {
      const duplicate = prevState.findIndex(
        (v) => v.ticker === data.ticker.toUpperCase()
      );
      if (duplicate !== -1) {
        const addShares = {
          ...prevState[duplicate],
          amount: +prevState[duplicate].amount + +data.amount,
          value: +prevState[duplicate].value + +data.price * +data.amount,
          change: prevState[duplicate].change,
          positive: data.dayChange > 0 ? true : false,
        };

        prevState[duplicate] = addShares;
        return [...prevState];
      } else {
        return [
          ...prevState,
          {
            ...data,
            id: data.ticker.toUpperCase(),
            ticker: data.ticker.toUpperCase(),
            value: (+data.amount * +data.price).toFixed(2),
          },
        ];
      }
    });
  };

  const saveListHandler = () => {
    //Make new list with just tickers and amounts
    const newList = tickerList.map((element) => {
      return {
        ticker: element.ticker,
        amount: element.amount,
      };
    });
    let url =
      "https://ec2-18-191-253-70.us-east-2.compute.amazonaws.com:8443/stockdata/portfolio/save";
    fetch(url, {
      method: "POST",
      body: JSON.stringify(newList),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.text();
        } else {
          console.log("Unable to save");
          throw new Error("Unable to Save");
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const removeTickerHandler = (ticker) => {
    setTickerList((prevState) => {
      return prevState.filter((el) => {
        return el.id !== ticker.currentTarget.id;
      });
    });
  };

  useEffect(() => {
    //Will only fire once when tokenData loads, if it is truthy we will reset our remaining timer.
    if (tokenData) {
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData]);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
    addTicker: addTickerHandler,
    removeTicker: removeTickerHandler,
    saveList: saveListHandler,
    tickerList: tickerList,
    firstName,
    base_url: "https://ec2-18-191-253-70.us-east-2.compute.amazonaws.com:8443",
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
