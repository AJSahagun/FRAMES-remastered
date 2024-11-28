import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../../config/db";
import { EncodingResponse } from "../../../types/db.types";
import { useWebSocket } from "../contexts/WebSocketContext";
import { useEncodingsStore } from "../stores/useEncodingStore";

export const useSync = () => {
  const { socket, isConnected } = useWebSocket();
  const encodingStore = useEncodingsStore();
  const encodings = useLiveQuery(() => db.encodings.toArray());
  const [syncStatus, setSyncStatus] = useState({
    isConnected: false,
    lastSyncTime: null as Date | null,
    error: null as string | null,
  });

  const addEncoding = async (
    id: number, 
    date_created: string, 
    name: string, 
    school_id: string, 
    encoding: number[]
  ) => {
    try {
      await db.encodings.add({ 
        id, 
        date_created, 
        name, 
        school_id, 
        encoding 
      });
      setSyncStatus(prev => ({
        ...prev,
        lastSyncTime: new Date(),
        error: null
      }));
    } catch (error) {
      console.error("Failed to add encoding to local storage", error);
      setSyncStatus(prev => ({
        ...prev,
        error: "Failed to sync encoding"
      }));
    }
  };

  const performInitialSync = async () => {
    if (!socket) return;

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
      console.error("Failed to fetch latest encoding for sync", error);
      setSyncStatus(prev => ({
        ...prev,
        error: "Initial sync failed"
      }));
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      setSyncStatus(prev => ({
        ...prev,
        isConnected: true,
        error: null
      }));
      performInitialSync();
    };

    const handleDisconnect = () => {
      setSyncStatus(prev => ({
        ...prev,
        isConnected: false,
        error: "Socket disconnected"
      }));
    };

    const handleSync = (data: EncodingResponse[]) => {
      data.forEach(encoding => 
        addEncoding(
          encoding.id_ai,
          encoding.date_created,
          encoding.name,
          encoding.school_id,
          encoding.encoding
        )
      );
    };

    const handleRegister = (data: EncodingResponse) => {
      encodingStore.setEncodings(data);
      addEncoding(
        data.id_ai, 
        data.date_created, 
        data.name, 
        data.school_id, 
        data.encoding
      );
    };

    // Register event listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("onSync", handleSync);
    socket.on("onRegister", handleRegister);

    // Cleanup
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("onSync", handleSync);
      socket.off("onRegister", handleRegister);
    };
  }, [socket, encodingStore]);

  return {
    encodings,
    syncStatus,
    isConnected
  };
};