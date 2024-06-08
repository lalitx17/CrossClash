import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { Button } from "../components/Button";
import {
    CrosswordProvider,
    DirectionClues,
    CrosswordGrid,
} from "@jaredreisinger/react-crossword";

export const INIT_GAME = "init_game";
export const GAME_OVER = "game_over";

const data = {
    across: {},
    down: {},
};

export const Game = () => {
    const socket = useSocket();
    const [started, setStarted] = useState(false);
    const [crosswordData, setcrosswordData] = useState(data);

    useEffect(() => {
        if (!socket) {
            return;
        }
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);

            switch (message.type) {
                case INIT_GAME:
                    if (message.payload) {
                        console.log(message.payload.data);
                        setcrosswordData(message.payload.data);
                        setStarted(true);
                    } else {
                        console.error("Invalid message payload");
                    }
                    break;
                case GAME_OVER:
                    console.log("Game Over");
                    break;
            }
        };

        return () => {
            socket.close();
        };
    }, [socket]);

    if (!socket) return <div>Connecting...</div>;

    return (
        <div className="pt-8">
            {!started && (
                <Button
                    onClick={() => {
                        socket.send(
                            JSON.stringify({
                                type: INIT_GAME,
                            })
                        );
                    }}
                >
                    Play
                </Button>
            )}
            {started && (
                <div className="flex flex-row justify-between mx-auto w-[95%] gap-x-10">
                    <CrosswordProvider data={crosswordData}>
                        <div className="overflow-y-scroll h-[400px] my-auto">
                            <DirectionClues direction="across" />
                        </div>
                        <div className="w-[35em]">
                            <CrosswordGrid />
                        </div>
                        <div className="overflow-y-scroll h-[400px] my-auto">
                            <DirectionClues direction="down" />
                        </div>
                    </CrosswordProvider>
                    {/* <Crossword data={crosswordData} /> */}
                </div>
            )}
        </div>
    );
};
