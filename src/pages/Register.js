import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import classes from "../styles/Register.module.css";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import AuthContext from "../context/auth-context";
import Footer from "../components/Footer";

const SignUp = (props) => {
  const history = useHistory();
  const userContext = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  //True for login, false for sign up
  const { page } = useParams();

  const [errorState, setErrorState] = useState({
    email: true,
    password: true,
    firstName: true,
    lastName: true,
    confirmPass: true,
  });

  const [isTouched, setIsTouched] = useState({
    email: false,
    password: false,
    firstName: false,
    lastName: false,
    confirmPass: false,
  });

  const emailRef = useRef("");
  const passwordRef = useRef("");
  const confirmPassRef = useRef("");
  const firstNameRef = useRef("");
  const lastNameRef = useRef("");

  //Make isloading state and show a brief Loading message?
  const [inValid, setInValid] = useState(false);

  const emailValueHandler = (event) => {
    if (emailRef.current.value.trim().length !== 0) {
      setErrorState((prevState) => {
        return { ...prevState, email: false };
      });
    }
    setEmail(event.target.value);
  };

  const passwordValueHandler = (event) => {
    if (passwordRef.current.value.trim().length !== 0) {
      setErrorState((prevState) => {
        return { ...prevState, password: false };
      });
    }

    setPassword(event.target.value);
  };

  const firstNameValueHandler = (event) => {
    if (firstNameRef.current.value.trim().length !== 0) {
      setErrorState((prevState) => {
        return { ...prevState, firstName: false };
      });
    }
    setFirstName(event.target.value);
  };

  const lastNameValueHandler = (event) => {
    if (lastNameRef.current.value.trim().length !== 0) {
      setErrorState((prevState) => {
        return { ...prevState, lastName: false };
      });
    }
    setLastName(event.target.value);
  };

  const confirmPassValueHandler = (event) => {
    if (confirmPassRef.current.value.trim().length !== 0) {
      setErrorState((prevState) => {
        return { ...prevState, confirmPass: false };
      });
    }
    setConfirmPass(event.target.value);
  };

  const logIn = page === "login";
  useEffect(() => {
    setInValid(false);
    setErrorState({
      email: true,
      password: true,
      firstName: true,
      lastName: true,
      confirmPass: true,
    });
    setIsTouched({
      email: false,
      password: false,
      firstName: false,
      lastName: false,
      confirmPass: false,
    });
  }, [page]);

  const submitHandler = (event) => {
    setInValid(false);

    event.preventDefault();

    if (
      (errorState.firstName === true ||
        errorState.lastName === true ||
        errorState.confirmPass === true ||
        errorState.email === true ||
        errorState.password === true) &&
      page === "signup"
    ) {
      return;
    }

    if (
      (errorState.email === true || errorState.password === true) &&
      page === "login"
    ) {
      return;
    }

    let bodyObject;
    if (page === "login") {
      bodyObject = {
        firstName: null,
        lastName: null,
        email: emailRef.current.value,
        password: passwordRef.current.value,
      };
    } else {
      bodyObject = {
        firstName: firstNameRef.current.value,
        lastName: lastNameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
      };
    }

    fetch(
      "http://ec2-18-191-253-70.us-east-2.compute.amazonaws.com:8080/registration/" +
        page,
      {
        method: "POST",
        body: JSON.stringify(bodyObject),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (!res.ok) {
          setInValid(true);
          throw new Error("Username not found!");
        } else {
          return res.text();
        }
      })
      .then((data) => {
        //Successful login or sign up, setting authentication JWT token.
        userContext.login(data);
        //Send user to the home screen
        history.replace("/");
      })
      .catch(() => {
        setInValid(true);
      });

    setEmail("");
    setPassword("");
    setConfirmPass("");
    setFirstName("");
    setLastName("");
  };

  const myFunction = (event) => {
    setIsTouched((prevState) => {
      const value = event.target.id;
      switch (value) {
        case "firstName":
          return { ...prevState, firstName: true };
        case "lastName":
          return { ...prevState, lastName: true };
        case "email":
          return { ...prevState, email: true };
        case "password":
          return { ...prevState, password: true };
        case "confirm-password":
          return { ...prevState, confirmPass: true };
        default:
          break;
      }
    });
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
            {!logIn && (
              <div autoComplete="off">
                <TextField
                  className={
                    errorState.firstName && isTouched.firstName
                      ? `${classes.fname}  ${classes.error}`
                      : `${classes.fname}`
                  }
                  id="firstName"
                  label="First Name"
                  variant="outlined"
                  type="text"
                  alt="First Name"
                  inputRef={firstNameRef}
                  value={firstName}
                  onChange={firstNameValueHandler}
                  onBlur={myFunction}
                />
                <TextField
                  className={
                    errorState.lastName && isTouched.lastName
                      ? `${classes.lname}  ${classes.error}`
                      : `${classes.lname}`
                  }
                  id="lastName"
                  label="Last Name"
                  variant="outlined"
                  type="text"
                  alt="Last Name"
                  inputRef={lastNameRef}
                  value={lastName}
                  onChange={lastNameValueHandler}
                  onBlur={myFunction}
                />
              </div>
            )}
            <TextField
              className={
                errorState.email && !logIn && isTouched.email
                  ? `${classes.input1}  ${classes.error}`
                  : `${classes.input1}`
              }
              id="email"
              label="Email"
              variant="outlined"
              type="Email"
              alt="Email Inpt"
              value={email}
              onChange={emailValueHandler}
              inputRef={emailRef}
              onBlur={myFunction}
            />
            <TextField
              className={
                errorState.password && isTouched.password
                  ? `${classes.input2}  ${classes.error}`
                  : `${classes.input2}`
              }
              id="password"
              label="Password"
              variant="outlined"
              type="password"
              alt="Password"
              autoComplete="off"
              inputRef={passwordRef}
              value={password}
              onChange={passwordValueHandler}
              onBlur={myFunction}
            />
            {!logIn && (
              <TextField
                className={
                  errorState.confirmPass && isTouched.confirmPass
                    ? `${classes.confirm}  ${classes.error}`
                    : `${classes.confirm}`
                }
                id="confirm-password"
                label="Confirm Password"
                variant="outlined"
                type="password"
                alt="Password"
                autoComplete="off"
                inputRef={confirmPassRef}
                value={confirmPass}
                onChange={confirmPassValueHandler}
                onBlur={myFunction}
              />
            )}
            <div className={classes.button}>
              <Button type="submit" variant="contained" size="large">
                Submit
              </Button>
            </div>
            {inValid && (
              <div className={classes.errorMsg}>
                {page === "login" && (
                  <p>
                    Wrong Username or Password.
                    <br /> Please Try again!
                  </p>
                )}
                {page === "signup" && <p>Email already exists!</p>}
              </div>
            )}
          </div>
        </div>
      </form>
      <Footer />
    </React.Fragment>
  );
};
export default SignUp;
