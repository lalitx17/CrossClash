import './App.css'
import { crossWordData } from './assets/crossword.ts'
import Crossword from '@slikslaks/react-crossword';
import { saveAs } from 'file-saver';

export default function App() {

  const data = {
    across: {}, 
    down: {}
  }

  // Populate the across clues
const acrossClues = crossWordData.clues.across;
acrossClues.forEach((clue, index) => {
  const { clueNum, clueText } = extractClueInfo(clue);
  const answer = getAnswer(index, 'across');
  const location = findClueLocation(clueNum, 'across');

  if (location) {
    data.across[clueNum] = {
      clue: clueText,
      answer: answer,
      row: location.row,
      col: location.col,
    };
  }
});

// Populate the down clues
const downClues = crossWordData.clues.down;
downClues.forEach((clue, index) => {
  const { clueNum, clueText } = extractClueInfo(clue);
  const answer = getAnswer(index, 'down');
  const location = findClueLocation(clueNum, 'down');

  if (location) {
    data.down[clueNum] = {
      clue: clueText,
      answer: answer,
      row: location.row,
      col: location.col,
    };
  }
});

console.log(data);

const saveFile = () => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  saveAs(blob, 'crosswordData.json');
};

  return (
    <>
      <div>
      <button onClick={saveFile}>Save Data</button>
      <Crossword data={data} useStorage={false} />
      </div>
    </>
  )
}

function extractClueInfo(clue) {
  const parts = clue.split('. ');
  const clueNum = parseInt(parts[0], 10);
  const clueText = parts[1];
  return { clueNum, clueText };
}

function getAnswer(clueNum: number, direction: 'across' | 'down') {
  const answers: { across: string[]; down: string[] } = crossWordData.answers;
  return answers[direction][clueNum];
}

// Function to find the starting location of a clue
function findClueLocation(clueNum, direction) {
  const gridNums = crossWordData.gridnums;
  const numRows = crossWordData.size.rows;
  const numCols = crossWordData.size.cols;

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const index = row * numCols + col;
      const gridNum = gridNums[index];

      if (gridNum === clueNum) {
        if (direction === 'across') {
          return { row: row, col: col };
        } else {
          return { row: row, col: col };
        }
      }
    }
  }

  return null; // Clue not found
}
