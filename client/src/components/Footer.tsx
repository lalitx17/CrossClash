import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primaryBackground text-white py-6 flex flex-col md:flex-row justify-between items-center px-4 w-full md:px-8">
      <div className="text-center md:text-left">
        <div className="text-white font-bold md:text-4xl mb-1">CrossClash</div>
        <div className="mt-4">
          <a href="/privacy" className="text-white hover:underline">Privacy Policy</a>
          <span className="mx-2">|</span>
          <a href="/terms" className="text-white hover:underline">Terms of Service</a>
        </div>
        <p className="mt-2 text-sm">&copy; Copyright © 2023 LitWords. All Rights Reserved.</p>
      </div>
      <div className="mt-4 md:mt-0 flex space-x-4">
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <img src="/images/twitter.png" alt="Twitter" className="w-8 h-8" />
        </a>
        <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
          <img src="/images/discord.png" alt="Discord" className="w-8 h-8" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
