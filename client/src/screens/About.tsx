import React from 'react';

export const About: React.FC = () => {
  const storyContent = [
    "🎉 Welcome to CrossClash! 🎉",
    "Are you ready for the ultimate crossword showdown? Introducing CrossClash, the thrilling new web app that will take your crossword gaming experience to a whole new level! This isn't just any crossword game—it's a summer project born from passion and crafted with the latest in web tech: React, MongoDB, Socket.io, and Node.js.",
    "Step into a world where words come to life and every puzzle is a battleground. Whether you're a solo wordsmith, a head-to-head challenger, or part of a team of word warriors, crossClash has got a mode for you:",
    "🧩 Single Player: Hone your skills and conquer the crossword board at your own pace. Perfect for those quiet moments when you just want to relax and flex your brainpower.",
    "⚔️ One vs. One: Ready for some friendly competition? Challenge a friend (or a foe!) to a word duel and see who comes out on top. It's all about quick thinking and strategic moves.",
    "👥 Team vs. Team: Rally your friends and form a team of crossword champions. Battle it out against another team and show them who really rules the word world. It's teamwork and tactics combined!",
    "So, what are you waiting for? Grab your dictionary, summon your inner word wizard, and dive into the exciting world of crossClash. Whether you're in it for the fun, the challenge, or the glory, there's a place for you here.",
    "Give it a try now and let the word games begin! 🌟"
  ];

  return (
    <div className="container flex flex-col gap-x-5 mx-auto px-4">
      <div className="mt-[120px]">
        <Section
          number="01"
          title="WHAT ?"
          content={storyContent}
        />
      </div>
      <Section
        number="02"
        title="CONTACT"
        content={
          <>
            <b>Socials</b> <br />
            <a href="https://www.linkedin.com/in/lalit-yadav-313b24227/" className="hover:underline">
              LinkedIn
            </a>
            &nbsp; &nbsp; / &nbsp; &nbsp;
            <a href="https://github.com/lalitx17" className="hover:underline">
              GitHub
            </a>
            &nbsp; &nbsp; / &nbsp; &nbsp;
            <a href="https://lalityadav.com.np/" className="hover:underline">
              Portfolio
            </a>
          </>
        }
      />
    </div>
  );
};

interface SectionProps {
  number: string;
  title: string;
  content: React.ReactNode | string[];
}

const Section: React.FC<SectionProps> = ({ number, title, content }) => (
  <div className="flex flex-wrap justify-center items-start mb-24">
    <div className="w-full lg:w-1/4 opacity-60 pl-4 lg:pl-22 mb-4 lg:mb-0 animate-[fadeInLeft_2s_ease-in-out]">
      /{number} &nbsp;&nbsp;&nbsp;{title}
    </div>
    <div className="w-full lg:w-3/4 text-lg px-4 opacity-70 animate-[fadeInRight_2s_ease-in-out] font-quicksand">
      {Array.isArray(content) 
        ? content.map((paragraph, index) => (
            <React.Fragment key={index}>
              {paragraph}
              {index < content.length - 1 && <><br /><br /></>}
            </React.Fragment>
          ))
        : content}
    </div>
  </div>
);

export default About;