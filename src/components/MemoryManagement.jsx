import React, { useState, useEffect } from 'react';

const MemoryManagement = ({ processes, setMemory, jobQueue, setJobQueue }) => {
  const [memory, setMemoryState] = useState(Array(1024).fill(null));
  const [jobQueueTableData, setJobQueueTableData] = useState([]);
  const [blocksLeft, setBlocksLeft] = useState(1024);
  const maxJobsBeforeScroll = 15;
  
  useEffect(() => {
    setJobQueueTableData(jobQueue);
  }, [jobQueue]);

  useEffect(() => {
    const updatedJobQueueTableData = jobQueueTableData.filter(process => process.status === 'Waiting');

    processes.forEach((process) => {
      if (process.status === 'New') {
        allocateMemory(process, updatedJobQueueTableData);
      } else if (process.status === 'Terminated') {
        deallocateMemory(process);
      }
    });

    // Remove terminated processes from the processes array
    const updatedProcesses = processes.filter(process => process.status !== 'Terminated');
    // Call any function or state update to handle the updated processes list if necessary

    setJobQueueTableData(updatedJobQueueTableData);
  }, [processes]);

  useEffect(() => {
    const calculateBlocksLeft = () => memory.filter(block => block === null).length;
    setBlocksLeft(calculateBlocksLeft());
  }, [memory]);

  const allocateMemory = (process, updatedJobQueueTableData) => {
    let currentBlockSize = 0;
    let bestFitIndex = -1;

    const allocateMinIdProcessFromJobQueue = () => {
      if (updatedJobQueueTableData.length === 0) return false;

      const minIdProcess = updatedJobQueueTableData.reduce((minProcess, currentProcess) => {
        return currentProcess.id < minProcess.id ? currentProcess : minProcess;
      });

      if (!minIdProcess) return false;

      currentBlockSize = 0;
      bestFitIndex = -1;
      for (let j = 0; j < memory.length; j++) {
        if (memory[j] === null) {
          currentBlockSize++;
          if (currentBlockSize >= minIdProcess.memorySize) {
            bestFitIndex = j - currentBlockSize + 1;
            break;
          }
        } else {
          currentBlockSize = 0;
        }
      }
      if (bestFitIndex !== -1) {
        const newMemory = [...memory];
        for (let k = bestFitIndex; k < bestFitIndex + minIdProcess.memorySize; k++) {
          newMemory[k] = minIdProcess.id;
        }
        setMemoryState(newMemory);
        setMemory(newMemory);
        minIdProcess.status = 'Ready';

        const pcbProcess = processes.find(p => p.id === minIdProcess.id);
        if (pcbProcess) {
          pcbProcess.status = 'Ready';
        }

        const updatedQueue = updatedJobQueueTableData.filter(p => p.id !== minIdProcess.id);
        setJobQueueTableData(updatedQueue);
        return true;
      }

      return false;
    };

    if (allocateMinIdProcessFromJobQueue()) return;

    if (memory.some(unit => unit === null)) {
      currentBlockSize = 0;
      bestFitIndex = -1;
      for (let i = 0; i < memory.length; i++) {
        if (memory[i] === null) {
          currentBlockSize++;
          if (currentBlockSize >= process.memorySize) {
            bestFitIndex = i - currentBlockSize + 1;
            break;
          }
        } else {
          currentBlockSize = 0;
        }
      }

      if (bestFitIndex !== -1) {
        const newMemory = [...memory];
        for (let i = bestFitIndex; i < bestFitIndex + process.memorySize; i++) {
          newMemory[i] = process.id;
        }
        setMemoryState(newMemory);
        setMemory(newMemory);
        process.status = 'Ready';
      } else {
        updatedJobQueueTableData.push(process);
        process.status = 'Waiting';
        setJobQueueTableData([...updatedJobQueueTableData]);
      }
    }
  };

  const deallocateMemory = (process) => {
    setMemoryState(prevMemory => {
      const newMemory = prevMemory.map(unit => (unit === process.id ? null : unit));
      setMemory(newMemory);
      return newMemory;
    });

    if (jobQueueTableData.length > 0) {
      const minIdProcess = jobQueueTableData.reduce((minProcess, currentProcess) => {
        return currentProcess.id < minProcess.id ? currentProcess : minProcess;
      });

      if (!minIdProcess) return;

      let currentBlockSize = 0;
      let bestFitIndex = -1;

      for (let j = 0; j < memory.length; j++) {
        if (memory[j] === null) {
          currentBlockSize++;
          if (currentBlockSize >= minIdProcess.memorySize) {
            bestFitIndex = j - currentBlockSize + 1;
            break;
          }
        } else {
          currentBlockSize = 0;
        }
      }

      if (bestFitIndex !== -1) {
        const newMemory = [...memory];
        for (let k = bestFitIndex; k < bestFitIndex + minIdProcess.memorySize; k++) {
          newMemory[k] = minIdProcess.id;
        }
        setMemoryState(newMemory);
        setMemory(newMemory);
        minIdProcess.status = 'Ready';

        const pcbProcess = processes.find(p => p.id === minIdProcess.id);
        if (pcbProcess) {
          pcbProcess.status = 'Ready';
        }

        const updatedQueue = jobQueueTableData.filter(p => p.id !== minIdProcess.id);
        setJobQueueTableData(updatedQueue);
      }
    }
  };

  const getColor = (processId) => {
    const process = processes.find(p => p.id === processId);
    return process ? process.color : 'white';
  };

  const getRowStyle = (process) => {
    return process.status === 'Running' ? { backgroundColor: getColor(process.id) } : {};
  };

  const renderMemory = () => {
    const memoryBlocks = [];
    let currentBlock = null;

    memory.forEach((unit, index) => {
      if (unit !== null) {
        if (currentBlock && currentBlock.processId === unit) {
          currentBlock.size++;
        } else {
          if (currentBlock) {
            memoryBlocks.push(currentBlock);
          }
          currentBlock = { processId: unit, size: 1 };
        }
      } else {
        if (currentBlock) {
          memoryBlocks.push(currentBlock);
          currentBlock = null;
        }
        memoryBlocks.push({ processId: null, size: 1 });
      }
    });

    if (currentBlock) {
      memoryBlocks.push(currentBlock);
    }

    return memoryBlocks.map((block, index) => (
      <div
        key={index}
        style={{
          width: '100%',
          height: `${block.size * 0.45}px`,
          backgroundColor: getColor(block.processId),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {block.processId !== null ? `${block.processId}` : ''}
      </div>
    ));
  };


  return (
    
    <div>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', transform: 'translateY(15%)' }}>

  <div style={{ display: 'flex', width: '1000px', border: '6px solid black', borderRadius: '20px', height: '600px', backgroundColor: 'white' }}>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div style={{ marginTop: '0px', marginLeft: '50px' }}>

  <h3>Ready Queue</h3>
  <div style={{ overflowY: 'scroll', height: '200px', width: '600px', scrollbarWidth: 'thin', scrollbarColor: '#000 #fff' }}>
    <style>
      {`
        /* Webkit browsers */
        ::-webkit-scrollbar {
          width: 12px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1; 
        }

        ::-webkit-scrollbar-thumb {
          background: #888; 
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #555; 
        }
      `}
    </style>
    <table style={{ width: '100%', textAlign: 'center', paddingBottom: '20px', color: 'black', border: '3px solid #000', borderCollapse: 'collapse', backgroundColor: 'white' }}>
      <thead style={{ position: 'sticky', top: '0', backgroundColor: '#FFC700', height: '40px', zIndex: '1' }}>
        <tr>
          <th style={{ border: '3px solid #000' }}>Process ID</th>
          <th style={{ border: '3px solid #000' }}>Burst Time</th>
          <th style={{ border: '3px solid #000' }}>Memory Size</th>
          <th style={{ border: '3px solid #000' }}>Arrival Time</th>
          <th style={{ border: '3px solid #000' }}>Priority</th>
          <th style={{ border: '3px solid #000', width: "14%" }}>Status</th>
        </tr>
      </thead>
      <tbody>
      {processes.filter(process => process.status !== 'Terminated' && process.status !== 'Waiting').map((process, index) => (
                          <tr key={index} style={{ ...getRowStyle(process), height: '30px' }}>
                    <td style={{ border: '3px solid #000' }}>{process.id}</td>
                    <td style={{ border: '3px solid #000' }}>{process.burstTime}</td>
                    <td style={{ border: '3px solid #000' }}>{process.memorySize}</td>
                    <td style={{ border: '3px solid #000' }}>{process.arrivalTime}</td>
                    {process.priority !== undefined && <td style={{ border: '3px solid #000' }}>{process.priority}</td>}
                    <td style={{ border: '3px solid #000', width: '14%' }}>{process.status}</td>
                  </tr>
                ))}
              </tbody>
    </table>
  </div>
</div>


<div style={{ marginLeft: '50px' }}>
  <h3>Job Queue</h3>
  <div style={{ 
    maxHeight: jobQueueTableData.length > maxJobsBeforeScroll ? '300px' : 'auto', 
    overflowY: 'scroll', 
    width: '600px', 
    height: '200px', 
    scrollbarWidth: 'thin', 
    scrollbarColor: '#000 #fff' 
  }}>
    <style>
      {`
        /* Webkit browsers */
        ::-webkit-scrollbar {
          width: 12px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1; 
        }

        ::-webkit-scrollbar-thumb {
          background: #888; 
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #555; 
        }
      `}
    </style>
    <table style={{ width: '100%', textAlign: 'center', border: '3px solid #000', borderCollapse: 'collapse', backgroundColor: 'white' }}>
      <thead style={{ position: 'sticky', top: 0, backgroundColor: '#FFC700', height: '40px' }}>
        <tr>
          <th style={{ border: '3px solid #000' }}>Process ID</th>
          <th style={{ border: '3px solid #000' }}>Burst Time</th>
          <th style={{ border: '3px solid #000' }}>Memory Size</th>
          <th style={{ border: '3px solid #000' }}>Arrival Time</th>
          <th style={{ border: '3px solid #000' }}>Priority</th>
          <th style={{ border: '3px solid #000', width: "14%" }}>Status</th>
        </tr>
      </thead>
      <tbody>
        {jobQueueTableData.map((process) => (
          <tr key={process.id} style={{ height: '30px' }}>
            <td style={{ border: '3px solid #000' }}>{process.id}</td>
            <td style={{ border: '3px solid #000' }}>{process.burstTime}</td>
            <td style={{ border: '3px solid #000' }}>{process.memorySize}</td>
            <td style={{ border: '3px solid #000' }}>{process.arrivalTime}</td>
            <td style={{ border: '3px solid #000' }}>{process.priority}</td>
            <td style={{ border: '3px solid #000', width: "14%" }}>{process.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

    </div>

    <div style={{ width: '25%', marginLeft: '0px', marginRight: '50px', marginTop: '12px' }}>
      <div style={{ backgroundColor: '#FFC700', border: '3px solid black', borderRadius: '10px', padding: '4px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h3 style={{ margin: '10px', }}>Memory Allocation</h3>
        <div style={{ border: '3px solid black', height: '100%', width: '80%',  }}>
          {renderMemory()}
        </div>
        <p style={{color: "black", fontWeight: "bold"}}>{blocksLeft} MB Left</p>
      </div>
    </div>
  </div>
</div>
</div>
  );
};

export default MemoryManagement;
