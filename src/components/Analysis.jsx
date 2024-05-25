import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Analysis() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const { analysisData } = state;
  console.log(analysisData);
  return (
    <div>
      <h1>analays</h1>
    </div>
  );
}

export default Analysis;
