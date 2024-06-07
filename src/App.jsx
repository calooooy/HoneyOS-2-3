import React, { useState, useEffect, useRef } from "react";
import Menu from "./components/Menu";
import MemoryManagement from "./components/MemoryManagement";
import Scheduler from "./components/Schedulers";
import Back from "./components/back.png";
import Image from "./components/bg.png"
import A from "./components/a.png";
import C from "./components/c.png"; // Ensure you have imported the new image
import B from "./components/b.png"
import D from "./components/d.png"
import WhiteBack from "./components/whiteback.png"; // Import the white version of the image



const colors = [
  "#FFA182", "#FFB399", "#FF33FF", "#FFFF99", "#00B3E6", "#FFD876",
  "#3366E6", "#999966", "#99FF99", "#B34D4D", "#C1E762", "#809900",
  "#E6B3B3", "#6680B3", "#66991A", "#FFBDEF", "#CCFF1A", "#FF1A66",
  "#E6331A", "#33FFCC", "#A2C093", "#B366CC", "#4D8000", "#B33300",
  "#CC80CC", "#CECEC0", "#991AFF", "#E666FF", "#4DB3FF", "#1AB399",
  "#FF51BA", "#33991A", "#CC9999", "#B3B31A", "#00E680", "#3DC982",
  "#809980", "#E6FF80", "#1AFF33", "#999933", "#FF3380", "#CCCC00",
  "#66E64D", "#4D80CC", "#9900B3", "#E64D66", "#4DB380", "#FF4D4D",
  "#99E6E6", "#6666FF"
];

const generateProcess = (id, currentTime) => {
  return {
    id,
    burstTime: Math.floor(Math.random() * 10) + 1,
    memorySize: Math.floor(Math.random() * 31) + 80,
    arrivalTime: currentTime,
    priority: Math.floor(Math.random() * 10) + 1,
    status: 'New',
    color: colors[id % colors.length],
    quantumLeft: 0
  };
};

const App = () => {
  const [policy, setPolicy] = useState("");
  const [showScheduler, setShowScheduler] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [processes, setProcesses] = useState([]);
  const [memory, setMemory] = useState(new Array(100).fill(null));
  const [jobQueue, setJobQueue] = useState([]);
  const [key, setKey] = useState(0);
  const [timer, setTimer] = useState(0);
  const processIdRef = useRef(1);
  const currentTimeRef = useRef(0);
  const nextArrivalTimeRef = useRef(0);
  const timerIntervalRef = useRef(null);
  const quantum = 2; // Define the time quantum for RR policy
  const [readyQueue, setReadyQueue] = useState([]);
  const [hovered, setHovered] = useState(false); // Add hovered state
  const [clicked, setClicked] = useState(false); // Add clicked state

  useEffect(() => {
    if (policy && isPlaying) {
      timerIntervalRef.current = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
        currentTimeRef.current += 1;

        if (currentTimeRef.current >= nextArrivalTimeRef.current) {
          const newProcess = generateProcess(processIdRef.current, currentTimeRef.current);
          processIdRef.current += 1;
          setProcesses(prevProcesses => [...prevProcesses, newProcess]);
          nextArrivalTimeRef.current = currentTimeRef.current + Math.floor(Math.random() * 5) + 1;
        }

        runProcess();
      }, 1000);

      return () => clearInterval(timerIntervalRef.current);
    }
  }, [policy, isPlaying]);

  const handleSelectPolicy = selectedPolicy => {
    setPolicy(selectedPolicy);
    setShowScheduler(false);
    setIsPlaying(false);
    setProcesses([]);
    setMemory(new Array(100).fill(null));
    setJobQueue([]);
    processIdRef.current = 1;
    currentTimeRef.current = 0;
    nextArrivalTimeRef.current = 0;
    setKey(prevKey => prevKey + 1);
    setTimer(0);
  };

  const runProcess = () => {
    setProcesses((prevProcesses) => {
      const updatedProcesses = prevProcesses.map(process => ({ ...process }));

      if (policy === 'FCFS') {
      // FCFS policy
      let runningProcess = updatedProcesses.find((p) => p.status === 'Running');
      if (runningProcess) {
        runningProcess.burstTime -= 1;
        if (runningProcess.burstTime <= 0) {
          runningProcess.status = 'Terminated';
          deallocateMemory(runningProcess);
          runningProcess = null;
        }
      }

      if (!runningProcess) {
        const nextProcess = updatedProcesses.find(
          (p) => p.status === 'Ready' && p.arrivalTime <= currentTimeRef.current
        );
        if (nextProcess) {
          nextProcess.status = 'Running';
          nextProcess.burstTime = nextProcess.burstTime - 1;
        }
      }
      } else if (policy === 'SJF') {
        // SJF Preemptive policy
        let runningProcess = updatedProcesses.find(p => p.status === 'Running');
        const readyProcesses = updatedProcesses.filter((p) => p.status === 'Ready' && p.arrivalTime <= currentTimeRef.current);

        if (runningProcess) {
          runningProcess.burstTime -= 1;
          if (runningProcess.burstTime <= 0) {
            runningProcess.status = 'Terminated';
            deallocateMemory(runningProcess);
            runningProcess = null;
          }
        }

        if (readyProcesses.length > 0) {
          const shortestJob = readyProcesses.sort((a, b) => a.burstTime - b.burstTime)[0];
          if (runningProcess) {
            if (shortestJob.burstTime < runningProcess.burstTime) {
              runningProcess.status = 'Ready';
              shortestJob.status = 'Running';
              shortestJob.burstTime = shortestJob.burstTime - 1;
            }
          } else {
            shortestJob.status = 'Running';
            shortestJob.burstTime = shortestJob.burstTime - 1;
          }
        }

      } else if (policy === 'Priority') {
        // Priority Preemptive policy
        let runningProcess = updatedProcesses.find((p) => p.status === 'Running');
        const readyProcesses = updatedProcesses.filter(
          (p) => p.status === 'Ready' && p.arrivalTime <= currentTimeRef.current
        );
      
        if (runningProcess) {
          runningProcess.burstTime -= 1;
          if (runningProcess.burstTime <= 0) {
            runningProcess.status = 'Terminated';
            deallocateMemory(runningProcess);
            runningProcess = null;
          } else {
            // Check if there is a higher priority process
            const highestPriorityProcess = readyProcesses.sort((a, b) => a.priority - b.priority)[0];
            if (highestPriorityProcess && highestPriorityProcess.priority < runningProcess.priority) {
              runningProcess.status = 'Ready';
              highestPriorityProcess.burstTime = highestPriorityProcess.burstTime - 1;
              highestPriorityProcess.status = 'Running';
              runningProcess = highestPriorityProcess;
            }
          }
        }
      
        if (!runningProcess && readyProcesses.length > 0) {
          const highestPriorityProcess = readyProcesses.sort((a, b) => a.priority - b.priority)[0];
          highestPriorityProcess.status = 'Running';
          highestPriorityProcess.burstTime = highestPriorityProcess.burstTime - 1;
        }
      } else if (policy === 'RR') {
        // Round Robin policy
        let runningProcess = updatedProcesses.find(p => p.status === 'Running');
        let nextIndex = 0;
        let remainingQuantum = quantum;
  
        if (runningProcess) {
          const runningProcessIndex = updatedProcesses.indexOf(runningProcess);
          runningProcess.burstTime -= 1;
          runningProcess.quantumLeft -= 1;
  
          if (runningProcess.burstTime <= 0) {
            runningProcess.status = 'Terminated';
            deallocateMemory(runningProcess);
            runningProcess = null;
          } else if (runningProcess.quantumLeft <= 0) {
            runningProcess.status = 'Ready';
            runningProcess = null;
          }
  
          nextIndex = (runningProcessIndex + 1) % updatedProcesses.length;
        }
  
        if (!runningProcess) {
          for (let i = 0; i < updatedProcesses.length; i++) {
            const index = (nextIndex + i) % updatedProcesses.length;
            const process = updatedProcesses[index];
            if (process.status === 'Ready' && process.arrivalTime <= currentTimeRef.current) {
              process.status = 'Running';
              process.burstTime = process.burstTime - 1;
              process.quantumLeft = remainingQuantum;
              break;
            }
          }
        }
      }
      // Check if there are processes in the job queue that can be allocated memory
      const updatedJobQueue = [];
      for (const process of jobQueue) {
        const freeSpaces = []; // Array to store available spaces
        let currentBlockSize = 0; // Variable to track the size of the current free space
        let bestFitIndex = -1; // Index of the best fit block
        let bestFitSize = Infinity; // Size of the best fit block

        // Iterate through memory to find available spaces
        for (let i = 0; i < memory.length; i++) {
          if (memory[i] === null) {
            currentBlockSize++; // Increase the size of the current free space
            if (currentBlockSize >= process.memorySize) { // If current free space is large enough
              if (currentBlockSize < bestFitSize) { // Check if it's the best fit so far
                bestFitIndex = i - currentBlockSize + 1; // Update best fit index
                bestFitSize = currentBlockSize; // Update best fit size
              }
            }
          } else {
            currentBlockSize = 0; // Reset the current free space size
          }
        }

        // If a best fit block is found
        if (bestFitIndex !== -1) {
          const newMemory = [...memory];
          for (let i = bestFitIndex; i < bestFitIndex + process.memorySize; i++) {
            newMemory[i] = process.id; // Allocate memory for the process
          }
          setMemory(newMemory);
          process.status = 'Ready'; // Update the process status to 'Ready'
          updatedProcesses.push(process);
        } else {
          // If no suitable block is found, keep the process in the job queue
          updatedJobQueue.push(process);
        }
      }
      setJobQueue(updatedJobQueue);

      return updatedProcesses;
    });
  };
  

  const handlePlayPause = play => {
    setIsPlaying(play);
    if (!play && timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
  };

  const handleNext = () => {
    setTimer(prevTimer => prevTimer + 1);
    currentTimeRef.current += 1;

    if (currentTimeRef.current >= nextArrivalTimeRef.current) {
      const newProcess = generateProcess(processIdRef.current, currentTimeRef.current);
      processIdRef.current += 1;
      setProcesses(prevProcesses => [...prevProcesses, newProcess]);
      nextArrivalTimeRef.current = currentTimeRef.current + Math.floor(Math.random() * 5) + 1;
    }

    runProcess();
  };

  const deallocateMemory = process => {
    setMemory(prevMemory => {
      const newMemory = prevMemory.map(unit => unit === process.id ? null : unit);
      setMemory(newMemory);
      return newMemory;
    });
  };

  const handleDelete = () => {
    setProcesses(prevProcesses => {
      const updatedProcesses = [...prevProcesses];
      const deletedProcess = updatedProcesses.pop();
      if (deletedProcess) {
        deallocateMemory(deletedProcess);
      }
      return updatedProcesses;
    });
  };

  const handleReset = () => {
    setIsPlaying(false);
    setProcesses([]);
    setMemory(new Array(100).fill(null));
    setJobQueue([]);
    processIdRef.current = 1;
    currentTimeRef.current = 0;
    nextArrivalTimeRef.current = 0;
    setKey(prevKey => prevKey + 1);
    setTimer(0);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
  };

  const handleAddProcess = () => {
    const newProcess = generateProcess(processIdRef.current, currentTimeRef.current);
    processIdRef.current += 1;
    setProcesses(prevProcesses => [...prevProcesses, newProcess]);
  };

  const handleGoBack = () => {
    setShowScheduler(true);
    setPolicy("");
  };

  const baseStyle = {
    height: "100vh",
    width: "100vw",
    margin: 0,
    padding: 0
  };

  // const backgroundImageStyle = {
  //   backgroundImage: `url(${Image})`,
  //   backgroundSize: "cover",
  //   backgroundPosition: "right bottom",
  //   backgroundRepeat: "no-repeat"
  // };


  
  return (
    <div style={policy === "" ? baseStyle : { ...baseStyle }}>
      {policy === "" ? (
        <Scheduler handleSelectPolicy={handleSelectPolicy} />
      ) : (
        <>
          <div style={{ position: 'fixed', top: -20, left: 0, width: '100%', zIndex: 1000 }}>
            <Menu
              onSelectPolicy={handleSelectPolicy}
              onPlayPause={handlePlayPause}
              onNext={handleNext}
              onReset={handleReset}
              onDelete={handleDelete}
              onAddProcess={handleAddProcess}
              isPlaying={isPlaying}
            />
          <button
  style={{
    transform: "translate(320%, 0.1%)",
    backgroundColor: clicked ? "black" : hovered ? "black" : "white", // Dynamically change button color
    color: clicked ? "white" : hovered ? "white" : "black", // Dynamically change text color
    height: "49px",
    width: "80px",
    borderRadius: "5px",
    border: '3px solid #000'
  }}
  onClick={handleGoBack}
  onMouseEnter={() => setHovered(true)} // Toggle hovered state on mouse enter
  onMouseLeave={() => setHovered(false)} // Toggle hovered state on mouse leave
>
  {/* Conditionally render the white version of the image when clicked or hovered */}
  {clicked || hovered ? (
    <img src={WhiteBack} style={{ height: "20px" }} /> // Replace WhiteBack with the path to your white image
  ) : (
    <img src={Back} style={{ height: "20px" }} /> // Default image
  )}
</button>

           
            <h3 style={{ transform: "translate(62%, 2450%)", color: "#000000" }}>
              Current Policy: {policy} | CPU TIME: {timer}s
            </h3>
          </div>
        <div style={{zIndex:2}}>
          <MemoryManagement
            key={key}
            processes={processes}
            memory={memory}
            setMemory={setMemory}
            jobQueue={jobQueue}
            setJobQueue={setJobQueue}
          />
          <img
  src={A}
  alt="A"
  style={{
    position: "absolute",
    zIndex: -1000,
    width: "auto", // Adjust the size of the image
    height: "auto", // Maintain aspect ratio
    top: "calc(50% - 250px)",
    left: "calc(50% - 100px)",
    animation: "rotateA 8s linear infinite"
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
    top: "calc(50% - 100px)",
    left: "calc(50% - 250px)",
    animation: "rotateB 8s linear infinite"
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
    bottom: "calc(50% - 250px)",
    right: "calc(50% - 100px)",
    animation: "rotateC 8s linear infinite"
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
    bottom: "calc(50% - 100px)",
    right: "calc(50% - 250px)",
    animation: "rotateD 8s linear infinite"
  }}
/>
<style>
  {`
  body {
    overflow: hidden;
  }
  @keyframes rotateA {
    0% {
      transform: translate(200px, 0px) rotate(0deg);
    }
    100% {
      transform: translate(200px, 0px) rotate(360deg);
    }
  }
  @keyframes rotateB {
    0% {
      transform: translate(0px, 200px) rotate(0deg);
    }
    100% {
      transform: translate(0px, 200px) rotate(360deg);
    }
  }
  @keyframes rotateC {
    0% {
      transform: translate(-200px, 0px) rotate(0deg);
    }
    100% {
      transform: translate(-200px, 0px) rotate(360deg);
    }
  }
  @keyframes rotateD {
    0% {
      transform: translate(0px, -200px) rotate(0deg);
    }
    100% {
      transform: translate(0px, -200px) rotate(360deg);
    }
  }
`}
</style>

          </div>
        </>
      )}
    </div>
  );
};

export default App;
