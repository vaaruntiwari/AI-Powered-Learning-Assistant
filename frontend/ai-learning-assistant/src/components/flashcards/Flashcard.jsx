import React, { useState } from "react";
import { RotateCw } from "lucide-react";

const Flashcard = ({ flashcard }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  if (!flashcard) return null;

  const frontText =
    flashcard.question ||
    flashcard.front ||
    flashcard.prompt ||
    flashcard.term ||
    "No Question Provided";

  const backText =
    flashcard.answer ||
    flashcard.back ||
    flashcard.response ||
    flashcard.definition ||
    "No Answer Provided";

  return (
    <div className="w-full max-w-md h-72 [perspective:1000px] select-none">
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className={`relative w-full h-full duration-500 [transform-style:preserve-3d] cursor-pointer transition-transform ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* FRONT SIDE (Question) */}
        <div className="absolute inset-0 w-full h-full bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xl shadow-slate-200/40 flex flex-col justify-between [backface-visibility:hidden]">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-emerald-600">
            <span>Question</span>
            <RotateCw className="w-4 h-4 text-slate-400" />
          </div>

          <div className="flex items-center justify-center my-auto text-center px-4">
            <p className="text-lg font-medium text-slate-800 leading-relaxed">
              {frontText}
            </p>
          </div>

          <div className="text-center text-xs font-medium text-slate-400">
            Click card to flip
          </div>
        </div>

        {/* BACK SIDE (Answer) */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl p-6 shadow-xl shadow-emerald-500/20 flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-emerald-100">
            <span>Answer</span>
            <RotateCw className="w-4 h-4 text-emerald-200" />
          </div>

          <div className="flex items-center justify-center my-auto text-center px-4">
            <p className="text-lg font-medium text-white leading-relaxed">
              {backText}
            </p>
          </div>

          <div className="text-center text-xs font-medium text-emerald-200">
            Click card to view question
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;