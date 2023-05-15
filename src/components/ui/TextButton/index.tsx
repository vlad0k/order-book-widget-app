import React, { FC, ReactNode } from "react";
import classes from "./styles.module.css";

interface ITextButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
  disabled?: boolean;
}

const TextButton: FC<ITextButtonProps> = ({ onClick, children, disabled }) => {
  return (
    <button className={classes.button} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default TextButton;
