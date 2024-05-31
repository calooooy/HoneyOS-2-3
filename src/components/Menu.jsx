import React from "react";
import Image from "../components/pause.png";
import Image1 from "../components/play.png";
import Image2 from "../components/nxt.png";
import Image3 from "../components/delete.png";
import Image4 from "../components/reset.png";
import Image5 from "../components/add.png";

const Menu = ({
  onSelectPolicy,
  onPlayPause,
  onNext,
  onReset,
  isPlaying,
  onDelete,
  onAddProcess,
}) => {
  const handlePlayPause = () => {
    onPlayPause(!isPlaying);
  };

  const buttonStyle = {
    backgroundColor: "yellow",
    height: "49px",
    width: "80px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "5px",
    transition: "background-color 0.01s",
    border: '3px solid #000'
  };

  const hoverStyle = {
    backgroundColor: "white",
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          transform: "translate(-17%, 100%)",
          gap: "10px",
        }}
      >
        {isPlaying ? (
          <button
            style={buttonStyle}
            onClick={handlePlayPause}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "white")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "yellow")}
          >
            <img src={Image} style={{ height: "20px" }} />
          </button>
        ) : (
          <button
            style={buttonStyle}
            onClick={handlePlayPause}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "white")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "yellow")}
          >
            <img src={Image1} style={{ height: "21px" }} />
          </button>
        )}

        <button
          style={buttonStyle}
          onClick={onAddProcess}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "white")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "yellow")}
        >
          <img src={Image5} style={{ height: "24px" }} />
        </button>

        <button
          style={buttonStyle}
          onClick={onNext}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "white")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "yellow")}
        >
          <img src={Image2} style={{ height: "24px" }} />
        </button>

        {/* <button
          style={buttonStyle}
          onClick={onDelete}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "white")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "yellow")}
        >
          <img src={Image3} style={{ height: "23px" }} />
        </button> */}

        <button
          style={buttonStyle}
          onClick={onReset}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "white")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "yellow")}
        >
          <img src={Image4} style={{ height: "24px" }} />
        </button>
      </div>
    </div>
  );
};

export default Menu;
