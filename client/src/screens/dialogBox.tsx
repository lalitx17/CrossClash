import { Button } from "../components/Button";



export const DialogBox = (title: string, message: string, onClose: () => void) => {
    
    
    return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur z-50">
      <div className="bg-white p-6 rounded shadow-lg text-center relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="mb-4">{message}</p>
        <div className="flex flex-row justify-between items-center gap-x-3">
          <Button
            onClick={() => {}}
          >
            Home
          </Button>

          <Button
            onClick={() => {}}
          >
            Play Again
          </Button>
        </div>
      </div>
    </div>
  )};