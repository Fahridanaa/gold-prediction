import { useEffect, useRef, useState } from "react";

export function useWebSocket(url: string) {
	const ws = useRef<WebSocket | null>(null);
	const [isConnected, setIsConnected] = useState(false);

	useEffect(() => {
		ws.current = new WebSocket(url);

		ws.current.onopen = () => setIsConnected(true);
		ws.current.onclose = () => setIsConnected(false);

		return () => {
			ws.current?.close();
		};
	}, [url]);

	return { isConnected, ws: ws.current };
}
