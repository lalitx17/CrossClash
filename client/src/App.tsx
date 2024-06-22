import { useNavigate } from "react-router-dom";
import short from 'short-uuid';


export default function App() {

  const redirect = useNavigate();

  const dualHandler = () => {
    redirect("/dualgame");
  }

  const singleHandler = () => {
    redirect("/singlegame")
  }

  const teamGameHandler = () => {
    const translator = short();
    const newGameId = translator.new();
    redirect(`/teamgame/${newGameId}`);
  }

  return (
    <><div>
        <div className="flex flex-row flex-wrap justify-around py-[10em] bg-white">
          <div className="flex flex-col justify-center gap-y-5">
            <div className="text-black font-bold md:text-4xl mb-1">Battle of the words.</div>
            <button onClick={dualHandler} className="bg-button text-white font-bold py-2 px-4 rounded hover:bg-buttonFocus">
              1v1
            </button>
            <button onClick={singleHandler} className="bg-button text-white font-bold py-2 px-4 rounded hover:bg-buttonFocus">
              Single
            </button>
            <button onClick={teamGameHandler} className="bg-button text-white font-bold py-2 px-4 rounded hover:bg-buttonFocus">
              Team
            </button>
          </div>
          <div>
            <img src="/images/crossword.png" height={400} width={400} alt="crossword" />
          </div>
        </div>
        </div>
    </>
  );
}
