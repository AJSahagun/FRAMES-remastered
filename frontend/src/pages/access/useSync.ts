import { useContext, useEffect, useState } from "react";
import { WebSocketContext } from "../context/WebSocketContext";
import { useLiveQuery } from "dexie-react-hooks";
import { useEncodingsStore } from "../EncodingStore";
import { db } from "../db";

  type ResponseType = {
    message: string;
    newEncoding: EncodingType;
  };
  type EncodingType = {
    idAi: number;
    name: string;
    encoding: number[];
    schoolId: string;
  };

export const useSync = () => {
  const socket = useContext(WebSocketContext);
  const encodingStore = useEncodingsStore();
  const encodings = useLiveQuery(() => db.encodings.toArray());
  const [isConnected, setIsConnected] = useState(socket.connected);

  const onSync = (data: EncodingType[]) => {
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
    console.log(encodings)
  };
  const onDisconnect = () => {
    setIsConnected(false);
    console.log("Disconnected");
  };
  const onMessage = (data: any) => {
    encodingStore.setEncodings(data);
    addEncoding(data.id_ai, data.name, data.school_id, data.encoding);
    console.log(data);
  };
  const onDeleteStale=(idAi:number[])=>{
    console.log("need to magremove the stale")
    console.log(idAi)
  }

  useEffect(() => {
    socket.on("connect", onConnect);
    socket.on("onMessage", onMessage); // server to client after registration
    socket.on("onDeleteStale", onDeleteStale); // delete stale records to localdb
    socket.on("onSync", onSync);
    socket.on("disconnect", onDisconnect);
    return () => {
      console.log("Unregistering");
      socket.off("connect", onConnect);
      socket.off("onMessage", onMessage);
      socket.off("onDeleteStale", onDeleteStale);
      socket.off("onSync", onSync);
      socket.off("disconnect", onDisconnect);
    };
  }, [socket]);

  return [isConnected,encodings]
};
