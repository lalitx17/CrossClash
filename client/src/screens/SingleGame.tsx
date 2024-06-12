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

export const SingleGame = () => {
    const socket = useSocket();
    const [started, setStarted] = useState(false);
    const [crosswordData, setcrosswordData] = useState(data);
    const [time, setTime] = useState<number>(0);
    const [isTimeout, setIsTimeout] = useState<boolean>(false);

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


    useEffect(() => {
        if (started) {
            const interval = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);


            if (time === 300) {
                setIsTimeout(true);
                clearInterval(interval);
            }

            return () => {
                clearInterval(interval);
            };
        }
    }, [time, started]);

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60)
            .toString()
            .padStart(2, '0');
        const seconds = (time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };


    if (!socket) return <div>Connecting...</div>;

    return (
        <div className="py-14">
            {!started && (
                <div className="flex w-2/5 mx-auto">
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
                </div>
            )}
            {started && (
                <div className="flex flex-row justify-between mx-auto w-[95%] gap-x-10">
                    <CrosswordProvider data={crosswordData}>
                        <div className="overflow-y-scroll h-[400px] my-auto ">
                            <DirectionClues direction="across" />
                        </div>
                        <div className="w-[35em]">
                            <div className="mb-4 text-center">
                                {isTimeout ? (
                                    <p className="text-lg text-red-600 font-semibold">Time's up!</p>
                                ) : (
                                    <div className="flex flex-row items-center justify-center gap-x-1">
                                        <img className="w-[25px] h-[25px] align-bottom flex-shrink-0" src="images/vintage-hourglass.png" alt="clock" />
                                        <p className="text-3xl text-gray-800 font-mono md:mb-[-8px]">{formatTime(time)}</p>
                                    </div>
                                )}
                            </div>
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
