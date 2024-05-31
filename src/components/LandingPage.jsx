import React from "react";

const LandingPage = ({ handleGoToScheduler }) => {
  return (
    <div>
      <h1>Welcome to the Landing Page</h1>
      <button onClick={handleGoToScheduler}>Go to Scheduler</button>
    </div>
  );
};

export default LandingPage;
