"use client";

import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { paper } from "@/lib/constants/testPaper";
import { PaperSchema } from "@/lib/types/paperSchema";
import { CheckOutlined } from "@ant-design/icons";
import { Typography, Layout, Menu, Divider, Radio, Card, Row, Col, theme } from "antd";
import { useState } from "react";

const { Title } = Typography;
const { Content } = Layout;

export default function PapersPage({
  params,
}: {
  params: Promise<{ subject: string; year: string; type: string }>;
}) {
  const { token } = theme.useToken();
  const [selectedQuestion, setSelectedQuestion] = useState<PaperSchema["questions"][0]>(
    paper.questions[0]
  );

  // Create menu items from questions
  const menuItems = paper.questions.map((question) => ({
    key: question.question_number.toString(),
    label: (
      <div style={{ display: "flex", justifyContent: "space-between", height: "100%" }}>
        <span>Q{question.question_number}</span>
        <div style={{ textAlign: "right", fontSize: "12px", color: token.colorTextSecondary }}>
          {question.subject_unit} ({question.marks} {question.marks > 1 ? "marks" : "mark"})
        </div>
      </div>
    ),
  }));

  // Handle menu selection
  const handleMenuSelect = ({ key }: { key: string }) => {
    const questionNumber = parseInt(key);
    const question = paper.questions.find((q) => q.question_number === questionNumber);
    if (question) setSelectedQuestion(question);
  };

  return (
    <Content style={{ padding: token.padding * 4 }}>
      <Title level={2}>
        {paper.subject} - {paper.year} - {paper.type}
      </Title>

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
              maxHeight: "80vh",
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
            <div style={{ fontSize: "18px" }}>
              <MarkdownRenderer content={selectedQuestion.question_text} />
            </div>

            <Divider style={{ margin: `${token.marginSM}px 0` }} />

            {/* Options */}
            {selectedQuestion.options && (
              <Radio.Group
                style={{ width: "100%", color: token.colorText }}
                disabled
                defaultValue={selectedQuestion.options.findIndex((opt) => opt.is_correct)}
              >
                {selectedQuestion.options.map((option, index) => {
                  const isCorrect = option.is_correct;

                  return (
                    <div
                      key={index}
                      style={{
                        marginBottom: token.marginSM,
                        padding: token.paddingSM,
                        borderRadius: token.borderRadiusLG,
                        backgroundColor: isCorrect ? token.colorSuccessBg : "transparent",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Radio value={index} style={{ marginRight: token.marginSM }}>
                        <div
                          style={{
                            fontSize: "18px",
                            fontFamily: "var(--font-answer, serif)",
                            color: token.colorText,
                          }}
                        >
                          <MarkdownRenderer content={option.option_text} />
                        </div>
                      </Radio>

                      {isCorrect && (
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
              </Radio.Group>
            )}
          </Card>
        </Col>
      </Row>
    </Content>
  );
}
