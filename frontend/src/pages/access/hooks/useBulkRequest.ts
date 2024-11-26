import { useEffect, useState } from "react";
import { db } from "../../../config/db";
import { HistoryService } from "../../../services/historyService";

export const useBulkRequest = () => {
  const [rows, setRows]=useState<number>(0);
  const [latestRequestTime, setLatestRequestTime]=useState("");

  const sendBulkRequest = async () => {
    const currentTime = new Date().toDateString();
    const usersWithHistory = await db.occupants
    .filter(user => user.time_out !== null)
    .toArray();
    
    if(usersWithHistory.length >0){
      setLatestRequestTime(currentTime)
      setRows(usersWithHistory.length)
      // bulk response to server here
      // 5. Call the /api/v2/history API to push the data to the history table
      const historyResponse = await HistoryService.recordHistory(usersWithHistory);
      if (!historyResponse.success) {
        throw new Error('Failed to record history');
      }
      else{
        //delete that rows in occupants
        const idsToDelete:any = usersWithHistory.map(record => record.id);
        await db.occupants.bulkDelete(idsToDelete);
      }
    }
    console.log("up to date")
  };

  useEffect(() => {
    const interval = setInterval(() => {
      sendBulkRequest();
    }, 60 * 60* 1000); // Every 1 hour

    return () => clearInterval(interval);
  }, []);

  return [rows, latestRequestTime]
};
