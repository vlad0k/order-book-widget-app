import React, { FC } from "react";
import cn from "classnames";
import classes from "./styles.module.css";
import TextButton from "components/ui/TextButton";

interface IOnlineIndicatorProps {
  isOnline?: boolean;
  onReconnect?: () => void;
}

const OnlineIndicator: FC<IOnlineIndicatorProps> = ({
  isOnline,
  onReconnect,
}) => {
  return (
    <div className={classes.wrapper}>
      <div
        className={cn(classes.circle, {
          [classes.red]: !isOnline,
          [classes.green]: isOnline,
        })}
      />

      <p className={classes.textIndicator}>
        {isOnline ? "Online" : "Disconnected"}
      </p>

      {onReconnect && (
        <TextButton onClick={onReconnect} disabled={isOnline}>
          Reconnect
        </TextButton>
      )}
    </div>
  );
};

export default OnlineIndicator;
