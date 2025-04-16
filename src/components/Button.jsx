import React from 'react';
import { Button } from 'react-bootstrap';

const CustomButton = ({ variant = 'primary', size = 'lg', onClick, children, disabled = false ,className , style }) => {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={style}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
