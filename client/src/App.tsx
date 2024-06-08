import { useNavigate } from "react-router-dom";


export default function App() {

  const redirect = useNavigate();

  const onevsoneHandler = () => {
    redirect("/game");
  }


  return (
    <><div>
        <div className="flex flex-row flex-wrap justify-around py-[10em] bg-secondaryBackground">
          <div className="flex flex-col justify-center gap-y-5">
            <div className="text-white font-bold md:text-4xl mb-1">Battle of the words.</div>
            <button onClick={onevsoneHandler} className="bg-button text-white font-bold py-2 px-4 rounded hover:bg-buttonFocus">
              1v1
            </button>
            <button className="bg-button text-white font-bold py-2 px-4 rounded hover:bg-buttonFocus">
              Single
            </button>
            <button className="bg-button text-white font-bold py-2 px-4 rounded hover:bg-buttonFocus">
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
