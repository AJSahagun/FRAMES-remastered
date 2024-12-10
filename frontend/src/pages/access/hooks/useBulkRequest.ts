import { useEffect, useState, useCallback } from "react";
import { db } from "../../../config/db";
import { HistoryService } from "../../../services/history.service";
import { useAuthStore } from "../../../services/auth.service";

interface BulkRequestStatus {
  rows: number;
  latestRequestTime: string;
  error: string | null;
}

export const useBulkRequest = () => {
  const { isAuthenticated } = useAuthStore();
  const [status, setStatus] = useState<BulkRequestStatus>({
    rows: 0,
    latestRequestTime: "",
    error: null
  });

  const sendBulkRequest = useCallback(async () => {
    if (!isAuthenticated()) {
      setStatus(prev => ({
        ...prev,
        error: "Not authenticated"
      }));
      return;
    }

    try {
      const currentTime = new Date().toISOString();
      const usersWithHistory = await db.occupants
        .filter(user => user.time_out !== null)
        .toArray();
      
      if (usersWithHistory.length > 0) {
        const historyResponse = await HistoryService.recordHistory(usersWithHistory);
        
        if (!historyResponse.success) {
          throw new Error('Failed to record history');
        }
        
        const idsToDelete = usersWithHistory
          .map(record => record.id)
          .filter((id): id is number => id !== undefined);

        if (idsToDelete.length > 0) {
          await db.occupants.where('id').anyOf(idsToDelete).delete();
        }
        
        setStatus({
          rows: usersWithHistory.length,
          latestRequestTime: currentTime,
          error: null
        });
      } else {
        console.log("No records to sync");
      }
    } catch (error) {
      console.error("Bulk request failed", error);
      setStatus(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : "Unknown error"
      }));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated()) return;

    const interval = setInterval(() => {
      console.log("req")
      sendBulkRequest();
    }, 5 * 60 * 1000); // Every 30 minutes

    return () => clearInterval(interval);
  }, [isAuthenticated, sendBulkRequest]);

  return status;
};