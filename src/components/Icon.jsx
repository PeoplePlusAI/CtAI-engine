import React from 'react';

const CustomIcon = ({ icon, size , color = '#000', className = '' }) => {
  return (
    <div className={className} style={{ width : size, height : size }}>
      {React.cloneElement(icon, { width : size, height : size, stroke: color })}
    </div>
  );
};

export default CustomIcon;
