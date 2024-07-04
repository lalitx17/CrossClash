import { useEffect, useState, useRef } from "react";
import { useSocket } from "../hooks/useSocket";
import { Button } from "../components/Button";
import {
  CrosswordProvider,
  DirectionClues,
  CrosswordGrid,
} from "@lit17/react-crossword";
import { formatTime } from "../assets/formatTime.ts";
import {
  INIT_GAME,
  GAME_OVER,
  DUAL_PLAYER,
  GAME_COMPLETED,
  SCORE_UPDATE,
} from "../assets/messages.ts";
import { CrosswordProviderImperative } from "@lit17/react-crossword";
import { DialogBox } from "./dialogBox.tsx";
import { useNavigate } from "react-router-dom";

import { Direction } from "@lit17/react-crossword/dist/types";

interface CrosswordClue {
  clue: string;
  answer: string;
  row: number;
  col: number;
}

interface CrosswordData {
  across: { [key: string]: CrosswordClue };
  down: { [key: string]: CrosswordClue };
}

const data = {
  across: {
    1: {
      clue: "one plus one",
      answer: "TWO",
      row: 0,
      col: 0,
    },
  },
  down: {
    2: {
      clue: "three minus two",
      answer: "ONE",
      row: 0,
      col: 2,
    },
  },
};

export const DualGame = () => {
  const socket = useSocket();
  const [started, setStarted] = useState(false);
  const [crosswordData, setCrosswordData] = useState<CrosswordData>(data);
  const [time, setTime] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [dialogBoxAppears, setDialogBoxAppears] = useState<boolean>(false);
  const [isDialogClosedManually, setIsDialogClosedManually] =
    useState<boolean>(false);

  const crosswordProviderRef = useRef<CrosswordProviderImperative | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null); // Updated type

  const [opponentWon, setOpponentWon] = useState<boolean>(false);

  const [playerScore, setPlayerScore] = useState<number>(0);
  const [opponentScore, setOpponentScore] = useState<number>(0);

  const [currentClue, setCurrentClue] = useState<string>("");
  const [direction, setDirection] = useState<string>("");
  const [currentNumber, setCurrentNumber] = useState<string | undefined>("");
  const [currentRow, setCurrentRow] = useState<number>(-1);
  const [currentCol, setCurrentCol] = useState<number>(-1);

  const [answerCount, setAnswerCount] = useState<number>(0);
  const [answer, setAnswer] = useState<string>("");
  const [submittedAnswer, setSubmittedAnswer] = useState<string>("");

  const [highlightBgColor, setHighlightBgColor] = useState("rgb(255,255,204)");
  const [focusBgColor, setFocusBgColor] = useState("rgb(255,255,0)");
  const [clueStatus, setClueStatus] = useState<{
    [key: string]: "correct" | "incorrect" | "unanswered";
  }>({});

  const redirect = useNavigate();

  useEffect(() => {
    if (socket) {
      socket.on("message", (message) => {
        switch (message.type) {
          case INIT_GAME:
            if (message.payload) {
              console.log(message.payload.data);
              setCrosswordData(message.payload.data);
              setStarted(true);
            } else {
              console.error("Invalid message payload");
            }
            break;
          case GAME_OVER:
            console.log("Game Over");
            break;
          case GAME_COMPLETED:
            setOpponentWon(true);
            setDialogBoxAppears(true);
            break;
          case SCORE_UPDATE:
            console.log(message.increment);
            setOpponentScore(
              (prevScore) => prevScore + parseInt(message.increment)
            );
            break;
          default:
            console.log("Unknown message type");
        }
      });
    }
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
      if (socket) {
        socket.emit("message", { mode: DUAL_PLAYER, type: GAME_COMPLETED });
      }
    }
  };

  const clueAnsweredCorrectly = (
    direction: Direction,
    number: string,
    answer: string
  ) => {
    if (!clueStatus[`${direction}-${number}`]) {
      setPlayerScore((prevScore) => prevScore + answer.length);
      if (socket) {
        socket.emit("message", {
          mode: DUAL_PLAYER,
          type: SCORE_UPDATE,
          incrementAmount: `${answer.length}`,
        });
      }
    }
    console.log("Correct Answer Yay", direction, number, answer);
    setHighlightBgColor("lightgreen");
    setFocusBgColor("green");
    setClueStatus((prevStatus) => ({
      ...prevStatus,
      [`${direction}-${number}`]: "correct",
    }));
  };

  const clueAnsweredInCorrectly = (
    direction: Direction,
    number: string,
    answer: string
  ) => {
    console.log("Incorrect Answer no", direction, number, answer);
    setHighlightBgColor("#CD5C5C");
    setFocusBgColor("red");
    setClueStatus((prevStatus) => ({
      ...prevStatus,
      [`${direction}-${number}`]: "incorrect",
    }));
  };

  const cellChange = (
    direction: Direction,
    number: string | undefined,
    row: number,
    col: number
  ) => {
    setDirection(direction);
    setCurrentNumber(number);
    const directionData = crosswordData[direction];

    if (number) {
      const clueObj = directionData[number];
      setCurrentClue(clueObj.clue);
      setAnswerCount(clueObj.answer.length);
      setCurrentRow(clueObj.row);
      setCurrentCol(clueObj.col);

      // Set background color based on stored status
      const clueKey = `${direction}-${number}`;
      if (clueStatus[clueKey] === "correct") {
        setHighlightBgColor("lightgreen");
        setFocusBgColor("green");
      } else if (clueStatus[clueKey] === "incorrect") {
        setHighlightBgColor("#CD5C5C");
        setFocusBgColor("red");
      } else {
        setHighlightBgColor("rgb(255,255,204)");
        setFocusBgColor("rgb(255,255,0)");
      }
    }
    console.log(direction, number, row, col);
  };

  useEffect(() => {
    console.log(currentClue);
  }, [currentClue]);

  if (isDialogClosedManually) {
    const inputs = document.querySelectorAll<HTMLInputElement>(
      `input[aria-label="crossword-input"]`
    );
    const answerInput = document.querySelectorAll<HTMLInputElement>(
      `input[aria-label="answer-input"]`
    );

    inputs.forEach((input) => {
      input.disabled = true;
    });

    answerInput.forEach((answer) => {
      answer.disabled = true;
    });
  }

  const handleDialogClose = () => {
    setDialogBoxAppears(false);
    setIsDialogClosedManually(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    if (value.length <= answerCount) {
      setAnswer(value);
    }
  };

  const handleSubmit = () => {
    setSubmittedAnswer(answer);
    setAnswer("");
  };

  useEffect(() => {
    if (submittedAnswer) {
      if (direction === "across") {
        for (let i = currentCol; i < currentCol + answerCount; i++) {
          crosswordProviderRef.current?.setGuess(
            currentRow,
            i,
            submittedAnswer[i - currentCol]
          );
        }
      } else if (direction === "down") {
        for (let i = currentRow; i < currentRow + answerCount; i++) {
          crosswordProviderRef.current?.setGuess(
            i,
            currentCol,
            submittedAnswer[i - currentRow]
          );
        }
      }
      setSubmittedAnswer("");
    }
  }, [submittedAnswer, direction, currentRow, currentCol, answerCount]);

  if (!socket) return <div>Connecting...</div>;

  return (
    <div>
      {!started && (
        <>
          <div className="flex w-2/5 mx-auto pt-14">
            <Button
              onClick={() => {
                socket.emit("message", { mode: DUAL_PLAYER, type: INIT_GAME });
              }}
            >
              Play
            </Button>
          </div>
        </>
      )}
      {started && (
        <div className="flex flex-row justify-between mx-auto w-[95%] gap-x-10">
          <CrosswordProvider
            data={crosswordData}
            useStorage={false}
            ref={crosswordProviderRef}
            onCrosswordComplete={crosswordCompleted}
            onCellSelected={cellChange}
            onAnswerCorrect={clueAnsweredCorrectly}
            onAnswerIncorrect={clueAnsweredInCorrectly}
            //
          >
            <div className="overflow-y-scroll h-[400px] mt-8 hidden md:block">
              <DirectionClues direction="across" />
            </div>
            <div className="w-[35em] flex flex-col gap-y-5">
              <div className="mx-auto text-center">
                <div className="flex items-center mb-4 gap-x-2 justify-center">
                  <div className="text-lg font-semibold text-center">
                    Score:
                  </div>
                  <div className="text-lg mt-[2.5px]">{playerScore}</div>
                </div>
                <div className="flex items-center mb-4 gap-x-2 justify-center">
                  <div className="text-lg font-semibold text-center">
                    Opponent Score:
                  </div>
                  <div className="text-lg mt-[2.5px]">{opponentScore}</div>
                </div>
              </div>
              <div className="border-x-4 border-b-4 border-t-[26px] px-4 pb-4 pt-8 border-primaryBackground rounded-lg bg-primaryBackground relative">
                <CrosswordGrid
                  theme={{
                    focusBackground: focusBgColor,
                    highlightBackground: highlightBgColor,
                  }}
                />
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
              <div className="bg-primaryBackground text-white text-center rounded-lg p-4 shadow-lg">
                <div className="font-semibold text-xl mb-2">Clues</div>
                <div className="uppercase text-sm mb-4">{direction}</div>
                <div className="mt-2 text-base">
                  {currentNumber && currentClue ? (
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-lg">
                        {currentNumber}.
                      </span>
                      <span className="mt-1">
                        {currentClue} ({answerCount})
                      </span>
                      <input
                        type="text"
                        aria-label="answer-input"
                        value={answer}
                        onChange={handleInputChange}
                        maxLength={answerCount}
                        className="mt-2 p-2 rounded text-black text-center"
                      />
                      <button
                        onClick={handleSubmit}
                        disabled={answer.length !== answerCount}
                        className={`mt-2 px-4 py-2 bg-button hover:bg-buttonFocus text-white font-bold rounded ${
                          answer.length !== answerCount
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        Submit
                      </button>
                    </div>
                  ) : (
                    <div className="italic text-sm text-gray-400">
                      Select a clue
                    </div>
                  )}
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
            <div className="overflow-y-scroll h-[400px] mt-8 hidden md:block">
              <DirectionClues direction="down" />
            </div>
          </CrosswordProvider>
        </div>
      )}
      <DialogBox
        title={
          opponentWon ? "Opponent Won" : isCompleted ? "Congratulations!" : ""
        }
        message={
          opponentWon
            ? "Your opponent Won!"
            : isCompleted
            ? "You completed the crossword!"
            : ""
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
