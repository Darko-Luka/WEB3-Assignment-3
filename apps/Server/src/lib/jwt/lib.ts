import crypto from "crypto";

// Encrypt sensitive data before encoding into JWT payload
export const encryptData = (data: any) => {
	const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY || "");
	const iv = Buffer.from(process.env.ENCRYPTION_IV || "");
	const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
	let encryptedData = cipher.update(JSON.stringify(data), "utf8", "hex");
	encryptedData += cipher.final("hex");
	return encryptedData;
};

// Decrypt sensitive data from JWT payload
export const decryptData = (encryptedData: string) => {
	const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY || "");
	const iv = Buffer.from(process.env.ENCRYPTION_IV || "");
	const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
	let decryptedData = decipher.update(encryptedData, "hex", "utf8");
	decryptedData += decipher.final("utf8");
	return JSON.parse(decryptedData);
};
