import { useEffect, useState } from "react";
import { useSync } from "../hooks/useSync";



const AccessComponent = () => {
  const [history, setHistory] = useState("");
  
  const [isConnected, encodings] = useSync()

  const onsubmit = () => {
    // socket.emit("newMessage", history);
    console.log(history)
  };
  useEffect(()=>{
    console.log(encodings);
  },[encodings])

  return (
    <div>
      {isConnected ? <h1>Connected</h1> : <h1>Disconnected</h1>}
      <input
        type="text"
        value={history}
        onChange={(e) => setHistory(e.target.value)}
      />
      <button onClick={onsubmit}>Submit</button>
    </div>
  );
};

export default AccessComponent;
