'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button, Card, Space, Typography, message } from 'antd';

type QuestionOption = {
  _id: string;
  option_text: string;
  option_image: string;
  is_correct: boolean;
};

type Question = {
  _id: string;
  question_number: number;
  question_text: string;
  subject_unit: string;
  options: QuestionOption[];
  answer: string;
  question_images: string[];
  marks: number;
  difficulty: string;
};

type Paper = {
  _id: string;
  year: number;
  subject: string;
  type: string;
  description: string;
  questions: Question[];
};

export default function PaperPage() {
  const { subject, year, paperType } = useParams() as {
    subject: string;
    year: string;
    paperType: string;
  };

  const [paper, setPaper] = useState<Paper | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchPaper = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/papers?subject=Mathematics&year=2025&type=MCQ`
        );
        const data = await res.json();
        setPaper(data[0]); // expecting array of papers
      } catch (error) {
        console.error('Failed to fetch paper:', error);
      }
    };

    fetchPaper();
  }, [subject, year, paperType]);

  const handleOptionSelect = (questionId: string, optionId: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = () => {
    if (!paper) return;
    if (Object.keys(answers).length !== paper.questions.length) {
      message.warning('Please answer all questions before submitting.');
      return;
    }
    setSubmitted(true);
  };

  if (!paper) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Typography.Title level={2}>
        {paper.subject} - {paper.type} ({paper.year})
      </Typography.Title>
      <Typography.Paragraph>{paper.description}</Typography.Paragraph>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {paper.questions.map((q) => {
          const selectedOptionId = answers[q._id];
          return (
            <Card key={q._id} title={`Q${q.question_number}: ${q.question_text}`}>
              <Space direction="vertical" style={{ width: '100%' }}>
                {q.options.map((opt) => {
                  const isSelected = selectedOptionId === opt._id;
                  const isCorrect = opt.is_correct;
                  const showCorrect = submitted && isCorrect;
                  const isWrongSelection = submitted && isSelected && !isCorrect;

                  return (
                    <Button
                      key={opt._id}
                      type={
                        showCorrect
                          ? 'primary'
                          : isWrongSelection
                          ? 'default'
                          : isSelected
                          ? 'dashed'
                          : 'default'
                      }
                      danger={isWrongSelection}
                      onClick={() => handleOptionSelect(q._id, opt._id)}
                      block
                    >
                      {opt.option_text}
                    </Button>
                  );
                })}
                {submitted && (
                  <Typography.Text type="secondary">
                    Correct Answer: {q.answer}
                  </Typography.Text>
                )}
              </Space>
            </Card>
          );
        })}

        <Button
          type="primary"
          size="large"
          onClick={handleSubmit}
          disabled={submitted}
        >
          Submit Answers
        </Button>
      </Space>
    </div>
  );
}
