import { exec } from "child_process";
import path from "path";
import util from "util";
import { NextResponse } from "next/server";
import fs from "fs/promises";

const execPromise = util.promisify(exec);

export async function POST(req: Request) {
  // รับ JSON body จาก request
  const { oldTag, newTag } = await req.json();

  // ตรวจสอบว่า oldTag และ newTag มีค่า
  if (!oldTag || !newTag) {
    return NextResponse.json({ error: "ต้องระบุ oldTag และ newTag" }, { status: 400 });
  }

  // กำหนด path ไปยังสคริปต์ check_config.js และไฟล์ output
  const scriptPath =
    process.env.CHECK_CONFIG_PATH ||
    path.resolve(__dirname, "../../../../../config-checker/scripts/check_config.js");
  const outputPath = path.resolve("/tmp/config-diff.json");

  // Debug: แสดง path ที่ใช้
  console.log("Attempting to access script at:", scriptPath);
  console.log("Output will be written to:", outputPath);

  try {
    // ตรวจสอบว่าไฟล์สคริปต์มีอยู่จริง
    await fs.access(scriptPath, fs.constants.R_OK);
  } catch (err: any) {
    console.error("File access error:", err.message);
    return NextResponse.json(
      { error: `ไม่พบสคริปต์หรือไม่มีสิทธิ์เข้าถึง: ${scriptPath}` },
      { status: 500 }
    );
  }

  try {
    // รันสคริปต์ Node.js โดยส่ง outputPath
    const { stdout, stderr } = await execPromise(`node ${scriptPath} ${oldTag} ${newTag} ${outputPath}`);
    if (stderr) {
      console.error("Script stderr:", stderr);
      throw new Error(stderr);
    }
    // อ่านผลลัพธ์จากไฟล์
    const result = JSON.parse(await fs.readFile(outputPath, 'utf-8'));
    // ลบไฟล์ชั่วคราว
    await fs.unlink(outputPath).catch(() => {});
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Execution error:", err.message);
    return NextResponse.json({ error: `การรันล้มเหลว: ${err.message}` }, { status: 500 });
  }
}