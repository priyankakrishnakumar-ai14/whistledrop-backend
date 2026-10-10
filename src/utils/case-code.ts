import crypto from "crypto";

const CHARACTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateCaseCode(): string {
  const bytes = crypto.randomBytes(8);

  let randomPart = "";

  for (let i = 0; i < 8; i++) {
    randomPart += CHARACTERS[bytes[i] % CHARACTERS.length];
  }

  return `WD-${randomPart.slice(0, 4)}-${randomPart.slice(4)}`;
}

export function hashCaseCode(caseCode: string): string {
  return crypto
    .createHash("sha256")
    .update(caseCode)
    .digest("hex");
}