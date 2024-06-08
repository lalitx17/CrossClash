import { useNavigate } from "react-router-dom";


export default function App() {

  const redirect = useNavigate();

  const onevsoneHandler = () => {
    redirect("/game");
  }



  return (
    <>
    <div className="min-h-screen bg-stone-800 flex flex-col items-center justify-center space-y-4">
      <button onClick={onevsoneHandler} className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
        1v1
      </button>
      <button className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700">
        Single
      </button>
      <button className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700">
        Team
      </button>
    </div>
    </>
  );
}
