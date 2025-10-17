"use client";

import { useState, useEffect } from "react";
import { Button, Typography, Alert, Space, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { QRCodeCanvas } from "qrcode.react";
import styles from "./styles.module.css";

const { Title, Paragraph, Text } = Typography;

const thaiNames = [
  "สมชาย",
  "สมหญิง",
  "วิไล",
  "ประเสริฐ",
  "สุนีย์",
  "ธนากร",
  "มินตรา",
  "ชัยวัฒน์",
  "นวลพรรณ",
  "จักรพงษ์",
];
const thaiSurnames = [
  "ใจดี",
  "สวยงาม",
  "รุ่งเรือง",
  "สุขสันต์",
  "ประเสริฐ",
  "วิบูลย์",
  "ชัยยุทธ",
  "นาคราช",
  "แสงจันทร์",
  "ดวงดาว",
];
const photoFiles = ["photo1.jpg", "photo2.jpg", "photo3.jpg"]; // รายชื่อไฟล์ใน public/images/photos

interface FakeID {
  id: string;
  fullName: string;
  birthDate: string;
  address: string;
  photo: string;
}

export default function ThaiIDGenerator() {
  const [fakeID, setFakeID] = useState<FakeID | null>(null);

  const generateThaiID = (): string => {
    const d1 = Math.floor(Math.random() * 8) + 1;
    const province = Math.floor(Math.random() * 90) + 10;
    const d2 = Math.floor(province / 10);
    const d3 = province % 10;
    const district = Math.floor(Math.random() * 99) + 1;
    const d4 = Math.floor(district / 10);
    const d5 = district % 10;
    const seq = Math.floor(Math.random() * 10000000);
    const d6 = Math.floor(seq / 1000000) % 10;
    const d7 = Math.floor(seq / 100000) % 10;
    const d8 = Math.floor(seq / 10000) % 10;
    const d9 = Math.floor(seq / 1000) % 10;
    const d10 = Math.floor(seq / 100) % 10;
    const d11 = Math.floor(seq / 10) % 10;
    const d12 = seq % 10;
    const digits = [d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12];
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += digits[i] * (13 - i);
    }
    let check = 11 - (sum % 11);
    if (check > 9) check = 0;
    return digits.join("") + check.toString();
  };

  const generateFakeData = (): FakeID => {
    const id = generateThaiID();
    const firstName = thaiNames[Math.floor(Math.random() * thaiNames.length)];
    const lastName =
      thaiSurnames[Math.floor(Math.random() * thaiSurnames.length)];
    const fullName = `${firstName} ${lastName}`;
    const birthYear = 1965 + Math.floor(Math.random() * 40);
    const birthMonth = Math.floor(Math.random() * 12) + 1;
    const birthDay = Math.floor(Math.random() * 28) + 1;
    const birthDate = `${birthDay.toString().padStart(2, "0")}/${birthMonth
      .toString()
      .padStart(2, "0")}/${birthYear}`;
    const provinces = [
      "กรุงเทพมหานคร",
      "เชียงใหม่",
      "ขอนแก่น",
      "ชลบุรี",
      "นครราชสีมา",
    ];
    const address = `123/45 หมู่ 6 ต.บางแสน อ.บางละมุง จ.${
      provinces[Math.floor(Math.random() * provinces.length)]
    } 20000`;
    const photo = `/images/photos/${
      photoFiles[Math.floor(Math.random() * photoFiles.length)]
    }`;
    return { id, fullName, birthDate, address, photo };
  };

  const handleGenerate = () => {
    const newID = generateFakeData();
    setFakeID(newID);
    navigator.clipboard.writeText(newID.id).then(() => {
      message.success("คัดลอกเลขบัตรประชาชนแล้ว!");
    });
  };

  useEffect(() => {
    handleGenerate();
  }, []);

  return (
    <div className={styles.container}>
      <Title level={1} className={styles.header}>
        สุ่มเลขบัตรประชาชนไทย 13 หลัก 🇹🇭
      </Title>
      <Paragraph className={styles.intro}>
        สุ่มเลขบัตรประชาชนที่ถูกต้องตามรูปแบบ แต่ไม่ใช่เลขจริง
        เพื่อปกป้องข้อมูลส่วนตัว
      </Paragraph>

      {fakeID && (
        <div className={styles.cardContainer}>
          <div className={styles.idCard}>
            <div className={styles.cardHeader}>
              <img src={fakeID.photo} alt="รูปถ่าย" className={styles.photo} />
              <div className={styles.personalInfo}>
                <Title level={4} className={styles.name}>
                  {fakeID.fullName}
                </Title>
                <Paragraph>เลขประจำตัวประชาชน</Paragraph>
                <Title level={2} className={styles.idNumber}>
                  {fakeID.id}
                </Title>
                <Paragraph>วันเกิด: {fakeID.birthDate}</Paragraph>
                <Paragraph>ที่อยู่: {fakeID.address}</Paragraph>
              </div>
            </div>
            <div className={styles.cardFooter}>
              <QRCodeCanvas
                value={fakeID.id}
                size={80}
                className={styles.qrCode}
              />
              <div className={styles.thaiFlag}>🇹🇭</div>
            </div>
          </div>
          <Space className={styles.actions}>
            <Button
              type="primary"
              icon={<CopyOutlined />}
              onClick={() =>
                navigator.clipboard
                  .writeText(fakeID.id)
                  .then(() => message.success("คัดลอกแล้ว!"))
              }
            >
              คัดลอกเลขบัตร
            </Button>
            <Button onClick={handleGenerate}>สุ่มใหม่</Button>
          </Space>
        </div>
      )}

      <div className={styles.explanation}>
        <Title level={3}>ความหมายเลขบัตรประชาชนแต่ละหลัก</Title>
        <Paragraph>
          <Text strong>หลักที่ 1:</Text> หมายถึงประเภทบุคคลซึ่งมี 8 ประเภท (เช่น
          ประเภท 1: คนไทยเกิดและแจ้งเกิดทันเวลา, ประเภท 2: แจ้งเกิดเกินกำหนด,
          ฯลฯ)
        </Paragraph>
        <Paragraph>
          <Text strong>หลักที่ 2-3:</Text>{" "}
          จังหวัดของสำนักทะเบียนที่ชื่ออยู่ในทะเบียนบ้าน
        </Paragraph>
        <Paragraph>
          <Text strong>หลักที่ 4-5:</Text>{" "}
          อำเภอหรือเทศบาลที่ชื่ออยู่ในทะเบียนบ้าน
        </Paragraph>
        <Paragraph>
          <Text strong>หลักที่ 6-10:</Text>{" "}
          กลุ่มของบุคคลแต่ละประเภทหรือเล่มสูติบัตร
        </Paragraph>
        <Paragraph>
          <Text strong>หลักที่ 11-12:</Text>{" "}
          ลำดับที่ของบุคคลในกลุ่มหรือใบสูติบัตร
        </Paragraph>
        <Paragraph>
          <Text strong>หลักที่ 13:</Text> ตัวเลขตรวจสอบความถูกต้องของ 12 หลักแรก
        </Paragraph>
      </div>

      <Alert
        message="หมายเหตุ"
        description="เลขที่สุ่มไม่ซ้ำกับคนจริง ใช้เพื่อความปลอดภัยข้อมูลเท่านั้น ไม่ใช้เพื่อหลอกลวงหรือผิดกฎหมาย"
        type="warning"
        showIcon
        className={styles.note}
      />
    </div>
  );
}
