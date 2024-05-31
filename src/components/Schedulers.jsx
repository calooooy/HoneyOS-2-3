import React, { useState } from "react";
import Image from "./fbg.png";
import Title from './last.png';
import Select from './select.png';
import FCFS from "./FCFS.gif";
import SJF from "./SJF.gif";
import PRIORITY from "./priority.gif";
import RR from "./RR.gif";
import A from "./a.png";
import C from "./c.png"; // Ensure you have imported the new image
import B from "./b.png"
import D from "./d.png"

const Scheduler = ({ handleSelectPolicy }) => {
  const [policy, setPolicy] = useState("");

  const handlePolicySelect = (selectedPolicy) => {
    setPolicy(selectedPolicy);
    handleSelectPolicy(selectedPolicy);
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <img
        src={Image}
        alt="Background"
        style={{
          position: "absolute",
          zIndex: -1,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <img
        src={Select}
        alt="Select"
        style={{
          position: "absolute",
          zIndex: 1,
          width: "100%",
          height: "80%",
          objectFit: "contain",
          transform: 'translate(0%, -36%)'
        }}
      />
      <img
        src={A}
        alt="A"
        style={{
          position: "absolute",
          zIndex: -1,
          width: "auto", // Adjust the size of the image
          height: "auto", // Maintain aspect ratio
          top: -500,
          left: -500,
          animation: "rotate 8s linear infinite"
        }}
      />
      <img
        src={B}
        alt="B"
        style={{
          position: "absolute",
          zIndex: -1,
          width: "auto", // Adjust the size of the image
          height: "auto", // Maintain aspect ratio
          top: -200,
          right: -100,
          animation: "rotate 8s linear infinite"
        }}
      />
      <img
        src={C}
        alt="C"
        style={{
          position: "absolute",
          zIndex: -1,
          width: "auto", // Adjust the size of the image
          height: "auto", // Maintain aspect ratio
          bottom: -500,
          right: -400,
          animation: "rotate 8s linear infinite"
        }}
      />
      <img
        src={D}
        alt="D"
        style={{
          position: "absolute",
          zIndex: -1,
          width: "auto", // Adjust the size of the image
          height: "auto", // Maintain aspect ratio
          bottom: -100,
          right: -500,
          animation: "rotate 9s linear infinite"
        }}
      />
      <style>
        {`
          @keyframes rotate {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
      <img
        src={Title}
        alt="Title"
        style={{
          position: "absolute",
          zIndex: 1,
          width: "335px",
          height: "150px",
          transform: 'translate(165%,190%)',
          objectFit: "contain",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "100px",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "10px",
              cursor: "pointer",
              transition: "color 0.3s",
              color: 'black',
              fontSize: '25px'
            }}
            onClick={() => handlePolicySelect("FCFS")}
            onMouseEnter={(e) => (e.target.style.color = "yellow")}
            onMouseLeave={(e) => (e.target.style.color = "black")}
          >
            <img src={FCFS} alt="FCFS" style={{ width: "180px",  }} />
            FCFS
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "10px",
              cursor: "pointer",
              transition: "color 0.3s",
              fontSize: '25px'

            }}
            onClick={() => handlePolicySelect("SJF")}
            onMouseEnter={(e) => (e.target.style.color = "yellow")}
            onMouseLeave={(e) => (e.target.style.color = "black")}
          >
            <img src={SJF} alt="SJF" style={{ width: "180px" }} />
            SJF
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "10px",
              cursor: "pointer",
              transition: "color 0.3s",
              fontSize: '25px'

            }}
            onClick={() => handlePolicySelect("Priority")}
            onMouseEnter={(e) => (e.target.style.color = "yellow")}
            onMouseLeave={(e) => (e.target.style.color = "black")}
          >
            <img src={PRIORITY} alt="PRIORITY" style={{ width: "188px", height: "100px" }} />
            Priority
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "10px",
              cursor: "pointer",
              transition: "color 0.3s",
              fontSize: '25px'

            }}
            onClick={() => handlePolicySelect("RR")}
            onMouseEnter={(e) => (e.target.style.color = "yellow")}
            onMouseLeave={(e) => (e.target.style.color = "black")}
          >
            <img src={RR} alt="RR" style={{ width: "180px" }} />
            Round Robin
          </span>
        </div>
      </div>
    </div>
  );
};

export default Scheduler;