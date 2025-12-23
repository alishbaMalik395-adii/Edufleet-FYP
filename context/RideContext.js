import React, { createContext, useState } from "react";

export const RideContext = createContext();

export const RideProvider = ({ children }) => {
  const [rideStarted, setRideStarted] = useState(false);

  return (
    <RideContext.Provider value={{ rideStarted, setRideStarted }}>
      {children}
    </RideContext.Provider>
  );
};