import { useContext, useEffect, useState } from "react";
import { WebSocketContext } from "../contexts/WebSocketContext";
import { useEncodingsStore } from "../../../stores/useEncodingStore";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../../config/db";
import { EncodingResponse } from "../../../types/db.types";


export const useSync = () => {
  const socket = useContext(WebSocketContext);
  const encodingStore = useEncodingsStore();
  const encodings = useLiveQuery(() => db.encodings.toArray());
  const [isConnected, setIsConnected] = useState(socket.connected);

  const onSync = (data: EncodingResponse[]) => {
    data.map((encoding) =>
      addEncoding(
        encoding.idAi,
        encoding.name,
        encoding.schoolId,
        encoding.encoding
      )
    );
  };

  const addEncoding=(id: number, name: string, schoolId: string, encoding: number[]) =>{
    try {
      db.encodings.add({ id, name, schoolId, encoding });
    } catch (error) {
      console.log("Failed to add encoding to local storage");
    }
  }
  const onConnect = async () => {
    setIsConnected(true);
    try {
      const recentEncoding = await db.encodings
        .toCollection()
        .reverse()
        .limit(1)
        .sortBy(":id");
      socket.emit(
        "syncEncodings",
        recentEncoding.length !== 0 ? recentEncoding[0]["id"] : 0
      );
    } catch (error) {
      console.log("Failed to fetch latest encoding");
    }
    console.log("Connected");
  };
  const onDisconnect = () => {
    setIsConnected(false);
    console.log("Disconnected");
  };
  const onMessage = (data: any) => {
    encodingStore.setEncodings(data);
    addEncoding(data.id_ai, data.name, data.school_id, data.encoding);
    console.log("new encoding: "+data);
  };

  useEffect(() => {
    socket.on("connect", onConnect);
    socket.on("onMessage", onMessage); // server to client after registration
    socket.on("onSync", onSync);
    socket.on("disconnect", onDisconnect);
    return () => {
      console.log("Unregistering");
      socket.off("connect", onConnect);
      socket.off("onMessage", onMessage);
      socket.off("onSync", onSync);
      socket.off("disconnect", onDisconnect);
    };
  }, [socket]);

  return [isConnected,encodings]
};
