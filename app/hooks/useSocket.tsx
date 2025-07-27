import { useEffect, useRef } from "react";
export type FoundMessage = {
    message: string, timestamp: string
}
type Handlers = {
  onFound?: (data: FoundMessage) => void;
};

export function useSocket(handlers: Handlers) {
  const socketRef = useRef<WebSocket | null>(null);

  
}




