import React from "react";

const Divider: React.FC = () => {
  const dividerStyle = {
    border: "none",
    borderTop: "1px solid rgb(255 255 255 / 10%)",
    margin: "1rem 0",
  };

  return <hr style={dividerStyle} />;
};

export default Divider;
