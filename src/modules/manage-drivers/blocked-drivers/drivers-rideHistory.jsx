import React from "react";
import { useLocation } from "react-router";
import DriverRideHistory from "../../../components/manage-drivers/driverRideHistory";

const BlockedDriversRideHistory = () => {
  const profileData = useLocation();

  return (
    <>
      <DriverRideHistory profileData={profileData} type={"blockedDrivers"} />
    </>
  );
};

export default BlockedDriversRideHistory;
