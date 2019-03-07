import React from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  Input,
  FormControlLabel,
  Checkbox
} from "@material-ui/core";
/* This component renders what would have been called a TextField, but this component isn't in the Material UI spec anymore.
   It's a combination of a FormControl with an input label and possibly form helper text.
*/
export const RenderTextField = ({
  label,
  input,
  meta: { touched, invalid, error },
  margin,
  rquired,
  variant,
  disabled,
  fullWidth,
  required,
  name,
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
  min,
  max,
  ...custom
}) => {
  return (
    <FormControl
      margin={margin}
      required={required}
      variant={variant}
      disabled={disabled}
      error={touched && invalid}
      fullWidth={fullWidth}
      {...custom}
    >
      <InputLabel
        htmlFor={name}
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
        name={name}
        placeholder={placeholder}
        readOnly={readOnly}
        rows={rows}
        rowsMax={rowsMax}
        type={type}
        min={min}
        max={max}
        {...input}
      />
      <FormHelperText>{touched && error}</FormHelperText>
    </FormControl>
  );
};

export const RenderCheckboxField = ({
  classes,
  disabled,
  inputRef,
  checked,
  label,
  labelPlacement,
  name,
  checkedIcon,
  color,
  disableRipple,
  icon,
  indeterminate,
  indeterminateIcon,
  inputProps,
  type,
  input
}) => {
  return (
    <FormControlLabel
      checked={checked ? checked : input.value ? true : false}
      classes={classes}
      disabled={disabled}
      inputRef={inputRef}
      label={label}
      labelPlacement={labelPlacement}
      onChange={input.onChange}
      value={name}
      control={
        <Checkbox
          checkedIcon={checkedIcon}
          color={color}
          disableRipple={disableRipple}
          icon={icon}
          indeterminate={indeterminate}
          indeterminateIcon={indeterminateIcon}
          inputProps={inputProps}
        />
      }
    />
  );
};
