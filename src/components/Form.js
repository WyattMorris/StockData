import React, { useContext, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import classes from "../styles/Form.module.css";
import NumberFormat from "react-number-format";
import AuthContext from "../context/auth-context";

const Form = () => {
  const userContext = useContext(AuthContext);

  const [tickerValue, setTickerValue] = useState("");
  const [shareValue, setShareValue] = useState("");
  const [isValid, setIsValid] = useState(true);

  const tickerRef = useRef("");
  const sharesRef = useRef("");

  const tickerValueHandler = (event) => {
    setTickerValue(event.target.value);
  };
  const shareValueHandler = (event) => {
    setShareValue(event.target.value);
  };

  const submitHandler = async (event) => {
    //Preventing the default form action of submission
    event.preventDefault();

    setIsValid(true);
    const url =
      "http://localhost:8080/stockdata/" +
      tickerRef.current.value +
      "/" +
      sharesRef.current.value;
    fetch(url, {
      headers: {
        Authorization: "Bearer " + userContext.token,
      },
    })
      .then((res) => {
        if (res.ok) {
          setIsValid(true);
          return res.json();
        } else {
          setIsValid(false);
          throw new Error("Ticker Not Found");
        }
      })
      .then((data) => {
        //Ran into issue where YahooFinance would return object with 90% null properties
        //Checking to see if the important ones are not null.

        if (data.price !== null || data.fullName !== null) {
          userContext.addTicker({
            ...data,
          });
        } else {
          setIsValid(false);
        }
      })
      .catch((err) => {
        console.log(err.message);
        setIsValid(false);
      });
    setTickerValue("");
    setShareValue("");
  };

  const returnTotal = (type) => {
    let totalValue = 0;
    userContext.tickerList.forEach((element) => {
      if (type === "value") {
        totalValue += +element.price * +element.amount;
      } else {
        totalValue += +element[type];
      }
    });
    return totalValue.toFixed(2);
  };

  return (
    <React.Fragment>
      <form
        onSubmit={submitHandler}
        className={classes.form}
        autoComplete="off"
      >
        <div className={classes.flexContainer}>
          <div className={classes.leftContainer}>
            <h1>Add to your Portfolio</h1>
            <div className={classes.inputs}>
              <div className={classes.space}>
                <TextField
                  className={classes.input1}
                  id="outlined-basic"
                  label="Stock Ticker"
                  variant="outlined"
                  type="text"
                  alt="Stock Ticker"
                  inputRef={tickerRef}
                  onChange={tickerValueHandler}
                  value={tickerValue}
                />
              </div>
              <TextField
                className={classes.input2}
                id="outlined-basic"
                label="Amount of Shares"
                variant="outlined"
                type="decimal"
                alt="Amount of Shares"
                inputRef={sharesRef}
                step={0.01}
                onChange={shareValueHandler}
                value={shareValue}
              />
              <div className={classes.button}>
                <Button type="submit" variant="contained">
                  Submit
                </Button>
              </div>
              <div className={classes.button}>
                <Button
                  type="button"
                  variant="contained"
                  className={classes.save}
                  onClick={userContext.saveList}
                >
                  Save Changes
                </Button>
              </div>
            </div>
            <div className={classes.rightContainer}>
              <h3>
                Value:&nbsp;
                <NumberFormat
                  value={returnTotal("value")}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                />
              </h3>
              <h3>
                Shares:&nbsp;
                <NumberFormat
                  value={returnTotal("amount")}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={""}
                />
              </h3>
              <h3>
                Day&nbsp;Change:&nbsp;
                <NumberFormat
                  value={(
                    returnTotal("change") / userContext.tickerList.length
                  ).toFixed(2)}
                  displayType={"text"}
                  thousandSeparator={true}
                />
                %
              </h3>
            </div>
          </div>
          {/* <div className={classes.rightContainer}>
            <h3>Totals</h3>
            <h3>
              Value:{" "}
              <NumberFormat
                value={returnTotal("value")}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"$"}
              />
            </h3>
            <h3>
              Shares:{" "}
              <NumberFormat
                value={returnTotal("amount")}
                displayType={"text"}
                thousandSeparator={true}
                prefix={""}
              />
            </h3>
            <h3>
              Day Change:{" "}
              <NumberFormat
                value={(
                  returnTotal("change") / userContext.tickerList.length
                ).toFixed(2)}
                displayType={"text"}
                thousandSeparator={true}
              />
              %
            </h3>
          </div> */}
        </div>
      </form>
      {!isValid && (
        <div className={classes.error}>
          <p>Please try again! Request failed.</p>
        </div>
      )}
    </React.Fragment>
  );
};

export default Form;
