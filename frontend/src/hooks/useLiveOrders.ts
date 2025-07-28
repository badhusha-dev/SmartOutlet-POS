import { useState, useEffect, useCallback } from 'react';
import { Order, WebSocketEvent } from '../types/pos';
import { usePOSStore } from '../store/posStore';

export const useLiveOrders = (outletId: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { addOrder, updateOrder, removeOrder } = usePOSStore();

  const handleWebSocketMessage = useCallback((event: MessageEvent) => {
    try {
      const data: WebSocketEvent = JSON.parse(event.data);
      
      switch (data.type) {
        case 'ORDER_CREATED':
          addOrder(data.order);
          break;
        case 'ORDER_UPDATED':
          updateOrder(data.order.id, data.order);
          break;
        default:
          console.warn('Unknown WebSocket event type:', data);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }, [addOrder, updateOrder]);

  useEffect(() => {
    if (!outletId) return;

    const wsUrl = `wss://api.coralserve.com/pos/ws?outlet=${outletId}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setIsConnected(true);
      setConnectionError(null);
      console.log('WebSocket connected for outlet:', outletId);
    };

    ws.onmessage = handleWebSocketMessage;

    ws.onclose = (event) => {
      setIsConnected(false);
      if (!event.wasClean) {
        setConnectionError('Connection lost. Attempting to reconnect...');
        console.warn('WebSocket connection closed unexpectedly');
      }
    };

    ws.onerror = (error) => {
      setConnectionError('WebSocket connection error');
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, [outletId, handleWebSocketMessage]);

  // Auto-reconnect logic
  useEffect(() => {
    if (!isConnected && connectionError) {
      const reconnectTimeout = setTimeout(() => {
        setConnectionError(null);
      }, 5000);

      return () => clearTimeout(reconnectTimeout);
    }
  }, [isConnected, connectionError]);

  return {
    isConnected,
    connectionError,
  };
};