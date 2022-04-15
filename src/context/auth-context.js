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
  if (tokenData) {
    initialToken = tokenData.token;
  }
  const [token, setToken] = useState(initialToken);

  useEffect(() => {
    if (token !== null) {
      const url = "http://localhost:8080/stockdata/portfolio/stocks";
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
        .catch((err) => {});
    }
  }, [token]);

  const [tickerList, setTickerList] = useState([]);

  //Converting truthy/falsy value to boolean
  const userIsLoggedIn = !!token;

  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem("token");
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
          id: prevState[duplicate].ticker.toUpperCase(),
          ticker: prevState[duplicate].ticker.toUpperCase(),
          amount: +prevState[duplicate].amount + +data.amount,
          price: +prevState[duplicate].price,
          exchange: prevState[duplicate].exchange,
          value: +prevState[duplicate].value + +data.price * +data.amount,
          fullName: prevState[duplicate].fullName,
          dividend: prevState[duplicate].dividend,
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
    console.log(newList);
    let url = "http://localhost:8080/stockdata/portfolio/save";
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
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const removeTickerHandler = (ticker) => {
    setTickerList((prevState) => {
      console.log(ticker.currentTarget.id);
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
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
