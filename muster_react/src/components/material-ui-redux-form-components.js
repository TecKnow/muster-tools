import React from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  Input
} from "@material-ui/core";

export const renderTextField = ({
  label,
  input,
  meta: { touched, invalid, error },
  margin,
  rquired,
  variant,
  disabled,
  fullWidth,
  required,
  controlName,
  autoComplete,
  autoFocus,
  disableUnderline,
  multiline,
  placeholder,
  readOnly,
  rows,
  rowsMax,
  type,
  disableLabelAnimation,
  shrinkLabel,
  formHelperText,
  ...custom
}) => {
  return (
    <FormControl
      margin={margin}
      required={required}
      variant={variant}
      disabled={disabled}
      error={error}
      fullWidth={fullWidth}
    >
      <InputLabel
        htmlFor={controlName}
        disableAnimation={disableLabelAnimation}
        shrink={shrinkLabel}
      >
        {label}
      </InputLabel>
      <Input
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        disableUnderline={disableUnderline}
        multiline={multiline}
        name={controlName}
        placeholder={placeholder}
        readOnly={readOnly}
        rows={rows}
        rowsMax={rowsMax}
        type={type}
        {...input}
        {...custom}
      />
      <FormHelperText>{formHelperText}</FormHelperText>
    </FormControl>
  );
};
