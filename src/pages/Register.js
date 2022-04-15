import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import classes from "../styles/SignUp.module.css";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import AuthContext from "../context/auth-context";

const SignUp = (props) => {
  const history = useHistory();
  const userContext = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //Make isloading state and show a brief Loading message?
  const [inValid, setInvalid] = useState(false);

  const emailValueHandler = (event) => {
    setEmail(event.target.value);
  };
  const passwordValueHandler = (event) => {
    setPassword(event.target.value);
  };

  const emailRef = useRef("");
  const passwordRef = useRef("");
  //True for login, false for sign up
  const { page } = useParams();

  const logIn = page === "login";
  useEffect(() => {
    setInvalid(false);
  }, [page]);

  const submitHandler = (event) => {
    setInvalid(false);
    event.preventDefault();

    fetch("http://localhost:8080/registration/" + page, {
      method: "POST",
      body: JSON.stringify({
        email: emailRef.current.value,
        password: passwordRef.current.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          setInvalid(true);
          throw new Error("Username not found!");
        } else {
          return res.text();
        }
      })
      .then((data) => {
        //Successful login or sign up, setting authentication JWT token.
        userContext.login(data);
        console.log(data);
        //Send user to the home screen
        history.replace("/");
      })
      .catch((err) => console.log(err.message));

    setEmail("");
    setPassword("");
  };

  return (
    <React.Fragment>
      <form
        className={classes.form}
        autoComplete="off"
        onSubmit={submitHandler}
      >
        <div className={classes.flexContainer}>
          {!logIn && <h1>Sign Up!</h1>}
          {logIn && <h1>Log In!</h1>}
          <div className={classes.inputs}>
            <div className={classes.space}>
              <TextField
                className={classes.input1}
                id="outlined-basic1"
                label="Username"
                variant="outlined"
                type="username"
                alt="Username Inpt"
                value={email}
                onChange={emailValueHandler}
                inputRef={emailRef}
              />
            </div>
            <TextField
              className={classes.input2}
              id="outlined-basic2"
              label="Password"
              variant="outlined"
              type="password"
              alt="Password"
              inputRef={passwordRef}
              value={password}
              onChange={passwordValueHandler}
              step=".1"
            />
            <div className={classes.button}>
              <Button type="submit" variant="contained">
                Submit
              </Button>
            </div>
          </div>
        </div>
        {inValid && (
          <div className={classes.error}>
            {page === "login" && (
              <p>
                Wrong Username or Password.
                <br /> Please Try again!
              </p>
            )}
            {page === "signup" && <p>Email already exists!</p>}
          </div>
        )}
      </form>
    </React.Fragment>
  );
};
export default SignUp;

/*
Without authentication, the user should not be able to access the profile pages.





*/
