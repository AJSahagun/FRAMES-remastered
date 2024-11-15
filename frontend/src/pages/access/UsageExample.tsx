import { useEffect } from "react";
import { useSync } from "./hooks/useSync"

const UsageExample = () => {
  const [isConnected, encodings] = useSync()

  useEffect(()=>{
    console.log(encodings);
  },[encodings])

  return (
    <div>
      {isConnected ? <h1>Connected</h1> : <h1>Disconnected</h1>}
    </div>
  )
}

export default UsageExample