import {useEffect, useState} from 'react';
import { useSocket } from '../hooks/useSocket';
import { Button } from '../components/Button';

export const INIT_GAME = "init_game";
export const GAME_OVER = "game_over";


export const Game = () => {
    const socket = useSocket();
    const [started, setStarted] = useState(false);

    useEffect(() => {
        if(!socket) {
            return;
        }

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);

            switch(message.type) {
                case INIT_GAME:
                    if (message.payload) {
                        console.log(message.payload.data);
                        setStarted(true);
                    } else {
                        console.error("Invalid message payload");
                    }
                    break;
                case GAME_OVER:
                    console.log("Game Over");
                    break;
            }
        }

        return () => {
            socket.close();
        }

    }, [socket]);

    if (!socket) return <div>Connecting...</div>;

    return (
        <div className="pt-8">
        {!started && <Button onClick={() => {
            socket.send(JSON.stringify({
                type: INIT_GAME
            }))
        }} >
            Play
        </Button>}
    </div>

    )

}
