import { Resume } from "../../models/index.js";
import { PDFParse } from "pdf-parse";

export async function fetchResumePdf(resume) {
  if (!resume || !resume.secureUrl) {
    throw new Error("Resume secure URL is missing");
  }

  const response = await fetch(resume.secureUrl);
  if (!response.ok) {
    throw new Error(`Failed to download resume PDF (${response.status})`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function extractTextFromPdf(buffer) {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error("Invalid PDF buffer");
  }

  const parser = new PDFParse({
    data: buffer,
  });

  const result = await parser.getText();

  await parser.destroy();

  return result?.text?.trim() || "";
}

async function doParseResume(resume) {
  if (!resume) {
    throw new Error("Resume document is required for parsing");
  }

  let parsedText = "";
  let parseError = null;
  let status = "failed";

  try {
    const pdfBuffer = await fetchResumePdf(resume);
    parsedText = await extractTextFromPdf(pdfBuffer);
    status = "completed";
  } catch (err) {
    parseError = String(err.message || "Resume parse failed");
    console.warn("Resume parse error", {
      resumeId: resume._id?.toString(),
      error: parseError,
    });
  }

  resume.parsedText = parsedText || null;
  resume.parseStatus = status;
  resume.parseError = parseError;
  resume.parsedAt = new Date();
  await resume.save();

  return resume.toObject();
}

export async function scheduleResumeParseById(userId, resumeId) {
  const resume = await Resume.findOne({ _id: resumeId, userId }).exec();
  if (!resume) {
    return null;
  }

  if (resume.mimeType !== "application/pdf") {
    resume.parseStatus = "failed";
    resume.parseError = "Unsupported resume mime type for parsing";
    resume.parsedAt = new Date();
    await resume.save();
    return resume.toObject();
  }

  resume.parseStatus = "pending";
  resume.parseError = null;
  await resume.save();

  void doParseResume(resume).catch((err) => {
    console.error("Background resume parse failed", err);
  });

  return resume.toObject();
}
