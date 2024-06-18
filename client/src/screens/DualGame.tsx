import { useEffect, useState, useRef } from "react";
import { useSocket } from "../hooks/useSocket";
import { Button } from "../components/Button";
import {
    CrosswordProvider,
    DirectionClues,
    CrosswordGrid,
} from "@lit17/react-crossword";
import { formatTime } from "../assets/formatTime.ts";
import { INIT_GAME, GAME_OVER, DUAL_PLAYER } from "../assets/messages.ts";
import { CrosswordProviderImperative } from "@lit17/react-crossword";
import { DialogBox } from "./dialogBox.tsx";
import { useNavigate } from "react-router-dom";


const data = {
    across: {},
    down: {},
};

export const DualGame = () => {
    const socket = useSocket();
    const [started, setStarted] = useState(false);
    const [crosswordData, setcrosswordData] = useState(data);
    const [time, setTime] = useState<number>(0);
    const [isTimeout, setIsTimeout] = useState<boolean>(false);
    const [isCompleted, setIsCompleted] = useState<boolean>(false);
    const [dialogBoxAppears, setDialogBoxAppears] = useState<boolean>(false);
    const [isDialogClosedManually, setIsDialogClosedManually] = useState<boolean>(false); // New state
    const crosswordProviderRef = useRef<CrosswordProviderImperative | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null); // Updated type

    const redirect = useNavigate();



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
            timerRef.current = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);

            return () => {
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                }
            };
        }
    }, [started]);

    useEffect(() => {
        if (time === 100000) {
            setIsTimeout(true);
            setDialogBoxAppears(true);
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
    }, [time]);

    //no scroll when the dialog box appears
    useEffect(() => {
        if (dialogBoxAppears) {
            document.body.classList.add("body-no-scroll");
        } else {
            document.body.classList.remove("body-no-scroll");
        }

        return () => {
            document.body.classList.remove("body-no-scroll");
        };
    }, [dialogBoxAppears]);

    const crosswordCompleted = (correct: boolean) => {
        if (!dialogBoxAppears && !isDialogClosedManually) {
            if (correct) {
                setIsCompleted(true);
                setDialogBoxAppears(true);
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                }
            }
        }
    };

    if (isDialogClosedManually) {
        const inputs = document.querySelectorAll<HTMLInputElement>(`input[aria-label="crossword-input"]`);
        inputs.forEach(input => {
            input.disabled = true;
        });
    }

    const handleDialogClose = () => {
        setDialogBoxAppears(false);
        setIsDialogClosedManually(true);
    };

    // const cellChange = (row: number, col: number, char: string) =>{
    //     console.log(row, col, char)
    // }

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
                                    mode: DUAL_PLAYER
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
                    <CrosswordProvider
                        data={crosswordData}
                        useStorage={false}
                        ref={crosswordProviderRef}
                        onCrosswordComplete={crosswordCompleted}
                    //  
                    >
                        <div className="overflow-y-scroll h-[400px] my-auto hidden md:block">
                            <DirectionClues direction="across" />
                        </div>
                        <div className="w-[35em] flex flex-col gap-y-5">
                            <div className="border-x-4 border-b-4 border-t-[26px] px-4 pb-4 pt-8 border-primaryBackground rounded-lg bg-primaryBackground relative">
                                <CrosswordGrid />
                                <div className="absolute top-0 right-4 flex items-center text-white px-2 py-1">
                                    <img
                                        src="images/clock.png"
                                        width={15}
                                        height={15}
                                        alt="clock"
                                        className="mr-2"
                                    />
                                    {formatTime(time)}
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    if (!isDialogClosedManually) {
                                        crosswordProviderRef.current?.reset();
                                    }
                                }}
                                className="px-6 py-2 mx-auto text-xl bg-button hover:bg-buttonFocus text-white font-bold rounded"
                            >
                                Clear
                            </button>
                        </div>
                        <div className="overflow-y-scroll h-[400px] my-auto hidden md:block">
                            <DirectionClues direction="down" />
                        </div>
                    </CrosswordProvider>
                </div>
            )}
            <DialogBox
                title={isTimeout ? "Time Out!" : isCompleted ? "Congratulations!" : ""}
                message={
                    isTimeout ? "You ran out of time!" : isCompleted ? "You completed the crossword!" : ""
                }
                onClose={handleDialogClose}
                onGoHome={() => redirect("/")}
                onPlayAgain={() => {
                    setStarted(false);
                    setTime(0);
                    setDialogBoxAppears(false);
                    setIsDialogClosedManually(false);
                }}
                visible={dialogBoxAppears}
            />
        </div>
    );
};




