"use client";

import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { PaperSchema } from "@/lib/types/paperSchema";
import { CheckOutlined } from "@ant-design/icons";
import { Typography, Layout, Menu, Divider, Radio, Card, Row, Col, theme, Button } from "antd";
import { useState } from "react";
import Loading from "./loading";
import Image from "next/image";

const { Title, Paragraph } = Typography;
const { Content } = Layout;

export default function PaperClient({ paper }: { paper: PaperSchema }) {
  // Extract parameters from the URL
  // Unwrap params Promise
  const [selectedQuestion, setSelectedQuestion] = useState<PaperSchema["questions"][0] | null>(
    paper.questions[0]
  );
  const { token } = theme.useToken();
  const [showAnswer, setShowAnswer] = useState(false);

  // Create menu items from questions
  const menuItems = paper?.questions.map((question) => ({
    key: question.question_number.toString(),
    label: (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <span style={{ fontStyle: "bold" }}>Q{question.question_number}</span>
        <div style={{ textAlign: "right", fontSize: "12px", color: token.colorTextSecondary }}>
          {question.subject_unit && (
            <span
              style={{
                marginRight: 4,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100px",
                display: "inline-block",
              }}
            >
              {question.subject_unit}
            </span>
          )}
          {question.question_text && (
            <span
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "200px",
                display: "inline-block",
              }}
            >
              {question.question_text}
            </span>
          )}{" "}
          {question.marks && `${question.marks} ${question.marks > 1 ? "marks" : "mark"}`}
        </div>
      </div>
    ),
  }));

  // Handle menu selection
  const handleMenuSelect = ({ key }: { key: string }) => {
    const questionNumber = parseInt(key);
    const question = paper?.questions.find((q) => q.question_number === questionNumber);
    if (question) {
      setSelectedQuestion(question);
      setShowAnswer(false); // Reset answer visibility when changing questions
    }
  };

  return (
    <>
      {paper && selectedQuestion ? (
        <Content style={{ padding: token.padding * 4 }}>
          <Title level={2}>
            {paper.subject} - {paper.year} - {paper.type}
          </Title>
          <Paragraph style={{ marginBottom: token.margin }}>{paper.description}</Paragraph>

          <Row gutter={48} style={{ marginTop: token.marginLG }}>
            {/* Question List (Left Side) */}
            <Col span={6}>
              <Title level={4}>Questions</Title>
              <Menu
                mode="vertical"
                items={menuItems}
                selectedKeys={[selectedQuestion.question_number.toString()]}
                onSelect={handleMenuSelect}
                style={{
                  borderRight: 0,
                  maxHeight: "60vh",
                  overflow: "auto",
                  borderRadius: token.borderRadius,
                }}
              />
            </Col>

            {/* Question Content (Right Side) */}
            <Col span={18}>
              <Title level={4}>Q{selectedQuestion.question_number}.</Title>
              <Card
                variant="outlined"
                style={{
                  borderColor: token.colorPrimaryBorder,
                  borderRadius: token.borderRadiusLG,
                  fontFamily: "var(--font-answer, serif)",
                }}
              >
                <div className="w-full flex flex-col">
                  <div
                    style={{
                      fontSize: "18px",
                    }}
                  >
                    <MarkdownRenderer content={selectedQuestion.question_text} />
                    {selectedQuestion.question_images.length > 0 && (
                      <div
                        style={{
                          marginTop: token.marginSM,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        {selectedQuestion.question_images.map((image, index) => (
                          <Image
                            key={index}
                            src={`data:image/jpg;base64,${image}`}
                            alt={`Question Image ${index + 1}`}
                            width={500}
                            height={300}
                            style={{
                              width: "50%",
                              maxWidth: "80%",
                              maxHeight: "300px",
                              objectFit: "contain",
                              borderRadius: token.borderRadiusLG,
                              marginBottom: token.marginSM,
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="w-fit self-end">
                    <Button type="link" onClick={() => setShowAnswer(!showAnswer)}>
                      {showAnswer ? "Hide Answer" : "Show Answer"}
                    </Button>
                  </div>
                </div>

                <Divider style={{ margin: `${token.marginSM}px 0` }} />

                {/* Options */}
                {selectedQuestion.options && (
                  <>
                    {selectedQuestion.options.map((option, index) => {
                      const isCorrect = option.is_correct;

                      return (
                        <div
                          key={index}
                          style={{
                            marginBottom: token.marginSM,
                            padding: token.paddingSM,
                            borderRadius: token.borderRadiusLG,
                            backgroundColor:
                              showAnswer && isCorrect ? token.colorSuccessBg : "transparent",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Radio
                            checked={showAnswer && isCorrect}
                            key={selectedQuestion.question_number + index}
                            value={index}
                            style={{ marginRight: token.marginSM }}
                          >
                            <div
                              style={{
                                fontSize: "18px",
                                fontFamily: "var(--font-answer, serif)",
                                color: token.colorText,
                              }}
                            >
                              <MarkdownRenderer content={option.option_text} />
                              {option.option_image && (
                                <Image
                                  src={`data:image/jpg;base64,${option.option_image}`}
                                  alt={`Option Image ${index + 1}`}
                                  width={500}
                                  height={300}
                                  style={{
                                    width: "50%",
                                    maxWidth: "80%",
                                    maxHeight: "300px",
                                    objectFit: "contain",
                                    borderRadius: token.borderRadiusLG,
                                    marginTop: token.marginSM,
                                  }}
                                />
                              )}
                            </div>
                          </Radio>

                          {showAnswer && isCorrect && (
                            <CheckOutlined
                              style={{
                                marginLeft: "auto",
                                color: token.colorSuccess,
                                fontSize: "20px",
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </>
                )}
              </Card>
              <div style={{ marginTop: token.marginLG, textAlign: "right" }}>
                <Button
                  type="primary"
                  onClick={() => {
                    const currentIndex = paper.questions.findIndex(
                      (q) => q.question_number === selectedQuestion.question_number
                    );
                    if (currentIndex < paper.questions.length - 1) {
                      const nextQuestion = paper.questions[currentIndex + 1];
                      setSelectedQuestion(nextQuestion);
                      setShowAnswer(false);
                    }
                  }}
                  disabled={
                    paper.questions.findIndex(
                      (q) => q.question_number === selectedQuestion.question_number
                    ) ===
                    paper.questions.length - 1
                  }
                >
                  Next Question
                </Button>
              </div>
            </Col>
          </Row>
        </Content>
      ) : (
        <Loading />
      )}
    </>
  );
}
