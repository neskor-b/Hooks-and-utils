import { useEffect, useState } from 'react';

type EffectiveType = 'slow-2g' | '2g' | '3g' | '4g';
type Threshold = 'low' | 'very-low' | 'good';

export interface NetworkInformation {
  since: number;
  online: boolean;
  downlink?: number;
  downlinkMax?: number;
  effectiveType?: EffectiveType;
  rtt?: number;
  saveData?: boolean;
  type?: string;
}

export function useNetworkState() {
  const [state, setState] = useState<NetworkInformation>(getNetworkState());

  useEffect(() => {
    const onOnline = () => {
      setState((prev) => ({
        ...prev,
        online: true,
        since: Date.now(),
      }));
    };

    const onOffline = () => {
      setState((prev) => ({
        ...prev,
        online: false,
        since: Date.now(),
      }));
    };

    const onConnectionChange = () => {
      setState({
        ...getNetworkState(),
        since: Date.now(),
      });
    };

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    const connection = getConnection();
    connection?.addEventListener('change', onConnectionChange);

    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      connection?.removeEventListener('change', onConnectionChange);
    };
  }, []);

  return {
    ...state,
    threshold: getThreshold(state?.effectiveType),
  };

  function getConnection() {
    return typeof navigator !== 'undefined'
      ? (navigator as any).connection
      : undefined;
  }

  function getNetworkState() {
    const connection = getConnection();
    const online =
      typeof navigator.onLine === 'boolean' ? navigator.onLine : true;
    const since = Date.now();

    if (!connection) {
      return { online, since };
    }

    return {
      downlink: connection.downlink,
      downlinkMax: connection.downlinkMax,
      effectiveType: connection.effectiveType,
      rtt: connection.rtt,
      saveData: connection.saveData,
      type: connection.type,
      online,
      since,
    };
  }

  function getThreshold(effectiveType?: EffectiveType): Threshold {
    switch (effectiveType) {
      case 'slow-2g':
      case '2g':
        return 'very-low';
      case '3g':
        return 'low';
      case '4g':
        return 'good';
      default:
        return 'good';
    }
  }
}
