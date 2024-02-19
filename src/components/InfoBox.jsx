import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./InfoBox.css";
const InfoBox = ({ title, cases, active, isRed, isBlue, total, ...props }) => {
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && "infoBox--selected"} 
      ${isRed && "infoBox--red"}  ${isBlue && "infoBox--blue"}`}
    >
      <CardContent>
        {/* title */}
        <Typography className="infoBox__title" color="textSecondary">
          {title}
        </Typography>
        {/* cases number */}
        <h2 className="infoBox__cases">{cases}</h2>
        {/* cases Total */}
        <Typography className="infoBox__total" color="textSecondary">
          Total {title}: {total}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default InfoBox;
