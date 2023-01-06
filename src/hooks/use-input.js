import { useReducer } from "react";

const initialInputState = {
  value: "",
  isTouched: false,
};

const inputStateReducer = (prevState, action) => {
  if (action.type === "INPUT") {
    return { value: action.value, isTouched: prevState.isTouched };
  }
  if (action.type === "BLUR") {
    return { value: prevState.value, isTouched: true };
  }
  if (action.type === "RESET") {
    return { value: "", isTouched: false };
  }

  return initialInputState;
};

const useInput = (validateValue) => {
  const [inputState, dispatchFn] = useReducer(
    inputStateReducer,
    initialInputState
  );

  const valueIsValid = validateValue(inputState.value);

  const error = !valueIsValid && inputState.isTouched;

  const valueChangeHandler = (e) => {
    dispatchFn({ type: "INPUT", value: e.target.value });
  };

  const inputBlurHandler = (e) => {
    //input was touched and lost focus
    dispatchFn({ type: "BLUR" });
  };

  const reset = () => {
    dispatchFn({ type: "RESET" });
  };

  return {
    value: inputState.value,
    error,
    isValid: valueIsValid,
    valueChangeHandler,
    inputBlurHandler,
    reset,
  };
};

export default useInput;
