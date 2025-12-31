//layout.js is a wrapper that stays the same on many pages.
import React from "react";

const MainLayout = ({ children }) => {
  return <div className="container mx-auto my-20">{children}</div>;
};

export default MainLayout;