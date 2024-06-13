import { useEffect, useState, useRef } from "react";
import { useSocket } from "../hooks/useSocket";
import { Button } from "../components/Button";
import {
  CrosswordProvider,
  DirectionClues,
  CrosswordGrid,
} from "@jaredreisinger/react-crossword";
import { formatTime } from "../assets/formatTime.ts";
import { INIT_GAME, GAME_OVER, SINGLE_PLAYER } from "../assets/messages.ts";
import { CrosswordProviderImperative } from "@jaredreisinger/react-crossword";
import { DialogBox } from "./dialogBox.tsx";

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
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [dialogBoxAppears, setDialogBoxAppears] = useState<boolean>(false);
  const crosswordProviderRef = useRef<CrosswordProviderImperative | null>(null);

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

      if (time === 10) {
        setIsTimeout(true);
        setStarted(false);
        setDialogBoxAppears(true);
        clearInterval(interval);
      }

      return () => {
        clearInterval(interval);
      };
    }
  }, [time, started]);

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
    if (!dialogBoxAppears){
    if (correct) {
      setIsCompleted(true);
      setDialogBoxAppears(true);
      setStarted(false);
    }
  }
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
                  mode: SINGLE_PLAYER,
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
          >
            <div className="overflow-y-scroll h-[400px] my-auto ">
              <DirectionClues direction="across" />
            </div>
            <div className="w-[35em] flex flex-col gap-y-5">
              <div className="mb-4 text-center"></div>
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
                  crosswordProviderRef.current?.reset();
                }}
                className="px-6 py-2 mx-auto text-xl bg-button hover:bg-buttonFocus text-white font-bold rounded"
              >
                Clear
              </button>
            </div>
            <div className="overflow-y-scroll h-[400px] my-auto">
              <DirectionClues direction="down" />
            </div>
          </CrosswordProvider>
        </div>
      )}
      {isTimeout && dialogBoxAppears && DialogBox("Time Out!", "You ran out of time!", () => setDialogBoxAppears(false))}
      {isCompleted && dialogBoxAppears && DialogBox("Congratulations!", "You completed the crossword!", () => setDialogBoxAppears(false))}
    </div>
  );
};
