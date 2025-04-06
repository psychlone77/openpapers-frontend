"use client";

import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { paper } from "@/lib/constants/testPaper";
import { PaperSchema } from "@/lib/types/paperSchema";
import { CheckIcon } from "@radix-ui/react-icons";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { Separator } from "radix-ui";
import { useState } from "react";

export default function PapersPage({
  params,
}: {
  params: Promise<{ subject: string; year: string; type: string }>;
}) {
    
//   const { subject, year, type } = await params;
  const [selectedQuestion, setSelectedQuestion] = useState<PaperSchema["questions"][0]>(
    paper.questions[0]
  );

  return (
    <main className="flex flex-col items-center w-full p-8">
      <div className="w-full">
        <h1 className="text-3xl font-bold">
          {paper.subject} - {paper.year} - {paper.type}
        </h1>
      </div>
      <div className="flex w-full mt-4">
        <div className="mr-20">
          <h1 className="text-xl">Questions</h1>
          <ScrollArea.Root className="max-h-screen w-52 overflow-hidden">
            <ScrollArea.Viewport className="h-full w-full p-2">
              {paper.questions.map((question) => (
                <div
                  key={question.question_number}
                  className={`flex justify-between items-center px-4 py-2 border border-accent-light rounded-2xl mb-2 hover:bg-background-light hover:cursor-pointer ${
                    selectedQuestion.question_number === question.question_number
                      ? "bg-background-light"
                      : ""
                  }`}
                  onClick={() => setSelectedQuestion(question)}
                >
                  <p className="text-lg font-bold">Q{question.question_number}</p>
                  <div className="text-right">
                    <p className="text-xs text-foreground-light">{question.subject_unit}</p>
                    <p className="text-xs text-foreground-light">
                      {question.marks} {question.marks > 1 ? "marks" : "mark"}
                    </p>
                  </div>
                </div>
              ))}
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation="vertical" className="flex w-2 bg-gray-200">
              <ScrollArea.Thumb className="flex-1 bg-gray-400 rounded" />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
        </div>
        {/* Question Content area */}
        <div className="flex-1">
          <h1 className="text-xl">Q{selectedQuestion.question_number}.</h1>
          <div className="border border-accent-light rounded-2xl p-4 font-answer text-lg">
            <MarkdownRenderer content={selectedQuestion.question_text} />
            <Separator.Root className="my-2 bg-gray-300 data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px" />
            <div className="mt-4">
              {selectedQuestion.options?.map((option, index) => (
                <div key={index} className={`flex items-center mb-2 p-2 rounded-2xl ${option.is_correct ? "bg-answer-correct" : ""}`}>
                  <input
                    type="radio"
                    id={`option-${index}`}
                    name="options"
                    className="mr-2"
                    checked={option.is_correct}
                    disabled
                  />
                  <label htmlFor={`option-${index}`} className="text-lg">
                    <MarkdownRenderer content={option.option_text} />
                  </label>
                  <CheckIcon style={{width: "24px", height: "24px"}} className={`ml-auto ${option.is_correct ? "text-green-500" : "hidden"}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* <p className="mt-4 text-lg">Search and view exam papers</p>
      <div className="mt-8">
        <p className="text-lg">Subject: {subject}</p>
        <p className="text-lg">Year: {year}</p>
        <p className="text-lg">Type: {type}</p>
      </div> */}
    </main>
  );
}
