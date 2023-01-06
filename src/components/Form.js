import React, { useEffect, useState } from "react";
import useInput from "../hooks/use-input";
import "./selector.css";
import "./Form.css";

const Form = (props) => {
  const [occupation, setOccupation] = useState([]);
  const [option, setOption] = useState();
  const [state, setState] = useState([]);
  const [stateOption, setStateOption] = useState();
  const [stateIsTouched, setStateIsTouched] = useState(false);
  const [occupationIsTouched, setOccupationIsTouched] = useState(false);

  useEffect(() => {
    fetch("https://frontend-take-home.fetchrewards.com/form")
      .then((data) => data.json())
      .then((val) => {
        val.states.map((states) => state.push(states.name));
        setOccupation(val.occupations);
      });
  }, []);

  const handleOccupationChange = (e) => {
    setOption(e.target.value);
  };

  const handleStateChange = (e) => {
    setStateOption(e.target.value);
  };

  const occupationBlurHandler = () => {
    setOccupationIsTouched(true);
  };
  const stateBlurHandler = () => {
    setStateIsTouched(true);
  };

  const {
    value: enteredFullName,
    error: nameEnteredError,
    isValid: nameIsValid,
    isTouched,
    valueChangeHandler: inputNameHandler,
    inputBlurHandler: nameBlurHandler,
    reset: nameReset,
  } = useInput((value) => value.trim() !== "");
  const {
    value: enteredEmail,
    error: emailEnteredError,
    isValid: emailIsValid,

    valueChangeHandler: inputEmailHandler,
    inputBlurHandler: emailBlurHandler,
    reset: emailReset,
  } = useInput((value) => value.includes("@"));
  const {
    value: enteredPassword,
    error: passwordEnteredError,
    isValid: passwordIsValid,

    valueChangeHandler: inputPassHandler,
    inputBlurHandler: passwordBlurHandler,
    reset: passwordReset,
  } = useInput((value) => value.length >= 5);

  let formIsValid = false;

  if (nameIsValid && emailIsValid && passwordIsValid && stateIsTouched) {
    formIsValid = true;
  }

  const formSubmitHandler = async (e) => {
    e.preventDefault();

    if (!formIsValid) {
      return;
    }

    try {
      let res = await fetch("https://httpbin.org/post", {
        method: "POST",
        body: JSON.stringify({
          name: enteredFullName,
          email: enteredEmail,
          password: enteredPassword,
          occupation: occupation,
          state: state,
        }),
      });

      if (res.status === 200) {
        nameReset();
        emailReset();
        passwordReset();
        alert("Thank you form has been received");
      } else {
      }
    } catch (err) {
      console.log(err);
    }
  };

  const nameInputClasses = nameEnteredError
    ? "form-control invalid"
    : "form-control";
  const emailInputClasses = emailEnteredError
    ? "form-control invalid"
    : "form-control";

  const passwordInputClasses = passwordEnteredError
    ? "form-control invalid"
    : "form-control";

  return (
    <form onSubmit={formSubmitHandler}>
      <div className="control-group">
        <h1>Fetch Challenge</h1>
        <div className={nameInputClasses}>
          <label htmlFor="full-name">Full Name</label>
          <input
            type="text"
            id="full-name"
            onChange={inputNameHandler}
            value={enteredFullName}
            onBlur={nameBlurHandler}
          ></input>
          {nameEnteredError && (
            <p className="error-text">Please don't leave your name empty!</p>
          )}
        </div>
        <div className={emailInputClasses}>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            onChange={inputEmailHandler}
            value={enteredEmail}
            onBlur={emailBlurHandler}
          ></input>
          {emailEnteredError && (
            <p className="error-text">Email must contain '@'</p>
          )}
        </div>
        <div className={passwordInputClasses}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={inputPassHandler}
            value={enteredPassword}
            onBlur={passwordBlurHandler}
          ></input>
          {passwordEnteredError && (
            <p className="error-text">
              Password must be at least 5 characters long
            </p>
          )}
        </div>
        <div className="select-state">
          <p>Select State</p>
          <select
            className="selector"
            onChange={handleStateChange}
            onBlur={stateBlurHandler}
          >
            {state.map((state, i) => (
              <option key={i} id="state" value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
        <div className="select-occupation">
          <p>Select occupation</p>
          <select
            className="selector"
            onChange={handleOccupationChange}
            id="occupation"
          >
            {occupation.map((occ, i) => (
              <option key={i} value={occ} required>
                {occ}
              </option>
            ))}
          </select>
        </div>
        {/* <div className="form-control"> */}
        <button className="submit-btn" disabled={!formIsValid}>
          Submit
        </button>
        {/* </div> */}
      </div>
    </form>
  );
};

export default Form;
