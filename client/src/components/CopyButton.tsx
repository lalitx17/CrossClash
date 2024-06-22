import React, { useState } from 'react';
import { Button } from './Button';

interface CopyButtonProps {
  gameId: string | undefined;
}

const CopyButton: React.FC<CopyButtonProps> = ({ gameId }) => {
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  const copyGameLink = () => {
    const gameLink = `${window.location.origin}/teamgame/${gameId}`;
    navigator.clipboard.writeText(gameLink).then(() => {
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 400);
    });
  };

  return (
    <div className="relative h-20"> 
      <Button onClick={copyGameLink}>Copy Game Link</Button>
      <div className="absolute w-full top-12"> 
        {showCopiedMessage && (
          <div className="mx-auto w-3/5 py-1 bg-gray-800 text-white text-center text-sm rounded-md transition-opacity duration-300 ease-in-out opacity-100">
            Link copied!
          </div>
        )}
      </div>
    </div>
  );
};

export default CopyButton;
