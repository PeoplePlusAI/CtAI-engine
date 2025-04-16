import React from "react";
import { Image } from "react-bootstrap";

 export default function CustomImage({ src, alt, width, height, rounded, fluid, className ,style }){
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      rounded={rounded}
      fluid={fluid}
      className={className}
      style={style}
    />
  );
};