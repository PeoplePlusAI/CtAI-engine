import React from "react";
import { Card, Button } from "react-bootstrap";

const CustomCard = ({ title, text, imgSrc,children, buttonText, onButtonClick , className }) => {
  return (
    <Card style={{width : '100%' }} className={className}>
      {imgSrc && <Card.Img variant="top" src={imgSrc} alt={title} />}
      <Card.Body style={{paddingTop : 0}}>
        <Card.Title >{title}</Card.Title>
        <Card.Text>{text}</Card.Text>
        {children}
        {buttonText && (
          <Button variant="primary" onClick={onButtonClick}>
            {buttonText}
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default CustomCard;
