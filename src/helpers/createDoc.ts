import fs from "node:fs";
import PDFDocument from "pdfkit";
type Data = {
	ID: string;
	status: string;
	department: string;
	destiny: string;
	aprovedBy: string | null | undefined;
};

type pdfOptions = {
	data: Data;
	filename: string;
};
export function createDoc({
	filename = "file.pdf",
	data,
}: pdfOptions): Promise<typeof PDFDocument> {
	return new Promise((resolve, reject) => {
		// Create a document
		const doc = new PDFDocument();

		// Pipe the PDF document to a writable stream
		const stream = fs.createWriteStream(filename);
		doc.pipe(stream);

		// Add content to the PDF
		const { ID, status, department, destiny, aprovedBy = "" } = data;
		doc.text(`Request Id: ${ID}`, { align: "left" });
		doc.text(`Status: ${status}`, { align: "left" });
		doc.text(`Department: ${department}`, { align: "left" });
		doc.text(`Destiny: ${destiny}`, { align: "left" });
		doc.text(`Aproved by: ${aprovedBy}`, { align: "left" });

		doc.end();
		resolve(doc);
	});
}
