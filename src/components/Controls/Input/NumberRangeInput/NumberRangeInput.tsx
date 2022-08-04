import React from 'react';
import Form from 'react-bootstrap/esm/Form';

interface IProps {
  id: string;
  classNameCustom: string;
  value: string;
  handleReturnValue: (
    isBetweenValuesIncomplete: boolean,
    value: string,
    valueSingle?: number,
    valueFrom?: number,
    valueTo?: number
  ) => void;
  enterPressed?: () => void;
  disabled?: boolean;
}

/*
Description: This control accepts text input in the following formats:
number1 - denotes an exact value. Value is returned in valueSingle. valueFrom and valueTo are returned empty.
<number1 - denotes a max value. Value is returned in valueTo. valueSingle and valueFrom are returned empty.
>number1 - denotes an min value. Value is returned in valueFrom. valueSingle and valueTo are returned empty.
number1-number2 - denotes a min and max value. Value is returned in valueFrom and valueTo. valueSingle is returned empty.

alpha characters are not allowed to be typed. Only numbers, as well as the symbols <,>,- are accepted as input. 
The symbols <,> are accepted only at the beginning
*/

const NumberRangeInput: React.FC<IProps> = (props) => {
  const regexpWhole = new RegExp('^[<>]?[0-9-]*$');
  const regexpPureNumber = new RegExp('^[0-9]*$');
  const regexpFrom = new RegExp('^[>][0-9]*$');
  const regexpTo = new RegExp('^[<][0-9]*$');
  const regexpBetweenIncomplete = new RegExp('^[0-9]+[-][0-9]*$');
  const regexpBetweenComplete = new RegExp('^[0-9]+[-][0-9]+$');
  const {
    id,
    classNameCustom,
    value,
    handleReturnValue,
    enterPressed,
    disabled,
  } = props;

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (
      enterPressed &&
      (event.key === 'Enter' || event.key === 'NumpadEnter')
    ) {
      enterPressed();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = event.target.value;
    if (regexpWhole.test(newValue)) {
      if (regexpPureNumber.test(newValue)) {
        console.log('Exact value: ', newValue);
        handleReturnValue(false, newValue, parseFloat(newValue));
      } else if (regexpFrom.test(newValue)) {
        const fromVal = newValue.substring(1, newValue.length);
        console.log('From value: ', fromVal);
        handleReturnValue(false, newValue, undefined, parseFloat(fromVal));
      } else if (regexpTo.test(newValue)) {
        const toVal = newValue.substring(1, newValue.length);
        console.log('To value: ', toVal);
        handleReturnValue(
          false,
          newValue,
          undefined,
          undefined,
          parseFloat(toVal)
        );
      } else if (regexpBetweenIncomplete.test(newValue)) {
        if (regexpBetweenComplete.test(newValue)) {
          const numbers = newValue.split('-');
          if (numbers.length === 2) {
            console.log(
              'Between values complete: ',
              numbers[0],
              ' - ',
              numbers[1]
            );
            handleReturnValue(
              false,
              newValue,
              undefined,
              parseFloat(numbers[0]),
              parseFloat(numbers[1])
            );
          }
        } else {
          console.log('Between values incomplete: ', newValue);
          handleReturnValue(true, newValue);
        }
      }
    } else {
      handleReturnValue(false, value);
    }
  };

  return (
    <Form.Control
      id={id}
      disabled={disabled}
      className={classNameCustom}
      type="text"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  );
};

export default NumberRangeInput;
