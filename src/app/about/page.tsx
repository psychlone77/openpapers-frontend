"use client";

import { Typography, Card, Row, Col, Space, Avatar } from "antd";

const { Title, Paragraph } = Typography;

const team = [
  {
    name: "Nithika Dias",
    role: "Cyber Security Engineering",
    contribution: "Implemented the frontend of the application.",
    src: "https://media.licdn.com/dms/image/v2/D5603AQHOZwpJyuJU0g/profile-displayphoto-shrink_400_400/B56ZdZwlbFHoAo-/0/1749557598486?e=1755734400&v=beta&t=FxxOiV8Y8xjOJ1tguaqT2qQYfwliRLHP-WzVRz0on74",
  },
  {
    name: "Nisith Dissanayake",
    role: "Data Science and Engineering",
    contribution: "Developed the image extraction model from past papers.",
    src: "https://media.licdn.com/dms/image/v2/D5603AQFU3UJDFOoCLw/profile-displayphoto-shrink_400_400/B56ZUHwpV5GsAg-/0/1739591949339?e=1755734400&v=beta&t=A3YwXpyGTE_lMN8Z4CSO5YWbvull-r2CDnJ0uS6JpsE",
  },
  {
    name: "Pavitha Dissanayake",
    role: "Data Science and Engineering",
    contribution: "Built the text extraction pipeline.",
    src: "https://media.licdn.com/dms/image/v2/D5603AQHH2sFTYzO8hw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1724753059247?e=1755734400&v=beta&t=WJo0Etg5gSCmEBzSIqWdEy9_qXL1Ud2lLZ2-dSn-zAo",
  },
  {
    name: "Pasindu Dulmith",
    role: "Data Science and Engineering",
    contribution: "Developed the backend, cloud database, and paper upload script.",
    src: "https://media.licdn.com/dms/image/v2/D5603AQEBXVVjbhl9gA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1702455481539?e=1755734400&v=beta&t=FSTPbZ2shHxvTY7SjY1R3WSwe3MunkD30bWFwTVwF-o",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <Title level={1} className="text-center mb-10">
          About Us
        </Title>

        <div className="mb-16 text-center">
          <Title level={2} className=" mb-4">
            Who We Are
          </Title>
          <Paragraph className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We are a group of third-year undergraduate students from the Department of Computer
            Science and Engineering at the University of Moratuwa. This project was developed as
            part of our Professional Portfolio module to help Sri Lankan Advanced Level students
            practice past papers and review answers effectively.
          </Paragraph>
        </div>

        <div>
          <Title level={2} className="text-gray-700 mb-8 text-center">
            Our Team
          </Title>
          <Row gutter={[24, 24]}>
            {team.map((member, index) => (
              <Col xs={24} md={12} key={index}>
                <Card className="hover:shadow-lg transition duration-300" hoverable>
                  <Space className="mb-4">
                    <Avatar
                      size={48}
                      className="bg-blue-100 flex items-center justify-center"
                      src={member.src}
                    />
                    <div>
                      <Typography.Title level={4} className="mb-0">
                        {member.name}
                      </Typography.Title>
                      <Typography.Text type="secondary">{member.role}</Typography.Text>
                    </div>
                  </Space>
                  <Paragraph className="text-gray-600">{member.contribution}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>
  );
}
