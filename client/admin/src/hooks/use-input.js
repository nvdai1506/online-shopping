import { useCallback, useState } from 'react';

const useInput = (validateValue) => {
  const [enteredValue, setEnteredValue] = useState('');

  const valueIsValid = validateValue(enteredValue);
  const hasError = !valueIsValid;

  const valueChangeHandler = useCallback ((event) => {
    setEnteredValue(event.target.value);
  },[]);


  const reset = () => {
    setEnteredValue('');
  };

  return {
    value: enteredValue,
    setValue: setEnteredValue,
    isValid: valueIsValid,
    hasError,
    valueChangeHandler,
    reset
  };
};

export default useInput;