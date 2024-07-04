import { useEffect, useState, useRef } from "react";
import { useSocket } from "../hooks/useSocket";
import { Button } from "../components/Button";
import {
  CrosswordProvider,
  DirectionClues,
  CrosswordGrid,
} from "@lit17/react-crossword";
import { formatTime } from "../assets/formatTime.ts";
import { INIT_GAME, GAME_OVER, SINGLE_PLAYER } from "../assets/messages.ts";
import { CrosswordProviderImperative } from "@lit17/react-crossword";
import { DialogBox } from "./dialogBox.tsx";
import { useNavigate } from "react-router-dom";

import { Direction } from "@lit17/react-crossword/dist/types";
import InputMask from "react-input-mask";


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
      clue: 'one plus one',
      answer: 'TWO',
      row: 0,
      col: 0,
    },
  },
  down: {
    2: {
      clue: 'three minus two',
      answer: 'ONE',
      row: 0,
      col: 2,
    },
  },
};


export const SingleGame = () => {
  const socket = useSocket();
  const [started, setStarted] = useState(false);
  const [crosswordData, setcrosswordData] = useState<CrosswordData>(data);
  const [time, setTime] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [timeInput, setTimeInput] = useState<string>("00:00:00");
  const [isTimeout, setIsTimeout] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [dialogBoxAppears, setDialogBoxAppears] = useState<boolean>(false);
  const [isDialogClosedManually, setIsDialogClosedManually] = useState<boolean>(false);


  const crosswordProviderRef = useRef<CrosswordProviderImperative | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null); // Updated type


  const [currentClue, setCurrentClue] = useState<string>("");
  const [direction, setDirection] = useState<string>("");
  const [currentNumber, setCurrentNumber] = useState<string | undefined>("");
  const [currentRow, setCurrentRow] = useState<number>(-1);
  const [currentCol, setCurrentCol] = useState<number>(-1);


  const [answerCount, setAnswerCount] = useState<number>(0);
  const [answer, setAnswer] = useState<string>("");
  const [submittedAnswer, setSubmittedAnswer] = useState<string>("");

  const [highlightBgColor, setHighlightBgColor] = useState('rgb(255,255,204)'); 
  const [focusBgColor, setFocusBgColor] = useState('rgb(255,255,0)');
  const [clueStatus, setClueStatus] = useState<{ [key: string]: 'correct' | 'incorrect' | 'unanswered' }>({});

  const redirect = useNavigate();



  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on('message', (message) => {
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
    });
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
    if (totalTime !== 0){
    if (time === totalTime) {
      setIsTimeout(true);
      setDialogBoxAppears(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }
  }, [time, totalTime]);

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

  const clueAnsweredCorrectly = (direction: Direction, number: string, answer: string) => {
    console.log("Correct Answer Yay", direction, number, answer);
    setHighlightBgColor('lightgreen');
    setFocusBgColor('green');
    setClueStatus(prevStatus => ({
      ...prevStatus,
      [`${direction}-${number}`]: 'correct'
    }));
  }

  const clueAnsweredInCorrectly = (direction: Direction, number: string, answer: string) => {
    console.log("Incorrect Answer no", direction, number, answer);
    setHighlightBgColor('#CD5C5C');
    setFocusBgColor('red');
    setClueStatus(prevStatus => ({
      ...prevStatus,
      [`${direction}-${number}`]: 'incorrect'
    }));
  }

  const cellChange = (direction: Direction, number: string | undefined, row: number, col: number) => {
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
      if (clueStatus[clueKey] === 'correct') {
        setHighlightBgColor('lightgreen');
        setFocusBgColor('green');
      } else if (clueStatus[clueKey] === 'incorrect') {
        setHighlightBgColor('#CD5C5C');
        setFocusBgColor('red');
      } else {
        setHighlightBgColor('rgb(255,255,204)');
        setFocusBgColor('rgb(255,255,0)');
      }
    }
    console.log(direction, number, row, col);
  }


  useEffect(() => {
    console.log(currentClue);
  }, [currentClue])



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
      if (direction === 'across') {
        for (let i = currentCol; i < currentCol + answerCount; i++) {
          crosswordProviderRef.current?.setGuess(currentRow, i, submittedAnswer[i - currentCol]);
        }
      } else if (direction === 'down') {
        for (let i = currentRow; i < currentRow + answerCount; i++) {
          crosswordProviderRef.current?.setGuess(i, currentCol, submittedAnswer[i - currentRow]);
        }
      }
      setSubmittedAnswer("");
    }
  }, [submittedAnswer, direction, currentRow, currentCol, answerCount]);

  const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTimeInput(value);
  };

  const parseTimeInput = (input: string) => {
    const parts = input.split(':');
    if (parts.length === 3) {
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      const seconds = parseInt(parts[2], 10);
      return (hours * 3600) + (minutes * 60) + seconds;
    }
    return 0;
  };

  const handlePlayClick = () => {
    const totalTime = parseTimeInput(timeInput);
    setTotalTime(totalTime);
    if (socket) {
      socket?.emit(
        JSON.stringify({
          type: INIT_GAME,
          mode: SINGLE_PLAYER,
        })
      );
    }
    setIsTimeout(false);
    setIsCompleted(false);
    setIsDialogClosedManually(false);
    setStarted(true);
  };

  if (!socket) return <div>Connecting...</div>;

  return (
    <div className="flex flex-col min-h-screen py-14">
      {!started && (
        <div>
        <div className="bg-primaryBackground flex flex-col md:w-2/5 w-[95%] mx-auto md:my-14 my-auto p-6 rounded-lg items-center justify-center">
        <label className="text-white mb-2 text-lg">Set Time</label>
        <InputMask
          mask="99:99:99"
          value={timeInput}
          onChange={handleTimeInputChange}
          className="mb-4 p-2 border rounded text-center"
          placeholder="HH:MM:SS"
        />
        <Button onClick={handlePlayClick}>Play</Button>
      </div>
      </div>
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
              <div className="border-x-4 border-b-4 border-t-[26px] px-4 pb-4 pt-8 border-primaryBackground rounded-lg bg-primaryBackground relative">
                <CrosswordGrid 
                theme = {{
                  focusBackground: focusBgColor,
                  highlightBackground: highlightBgColor
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
                      <span className="font-bold text-lg">{currentNumber}.</span>
                      <span className="mt-1">{currentClue} ({answerCount})</span>
                      <input
                        type="text"
                        value={answer}
                        onChange={handleInputChange}
                        maxLength={answerCount}
                        className="mt-2 p-2 rounded text-black text-center"
                      />
                      <button
                        onClick={handleSubmit}
                        disabled={answer.length !== answerCount}
                        className={`mt-2 px-4 py-2 bg-button hover:bg-buttonFocus text-white font-bold rounded ${answer.length !== answerCount ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        Submit
                      </button>
                    </div>
                  ) : (
                    <div className="italic text-sm text-gray-400">Select a clue</div>
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
