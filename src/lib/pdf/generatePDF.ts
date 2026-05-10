// PDF generation using html2canvas + jsPDF
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export interface PDFOptions {
  elementId: string;
  filename?: string;
  onProgress?: (n: number) => void;
}

export async function generateResultsPDF({
  elementId,
  filename = 'SmartCare-Assessment-Results',
  onProgress,
}: PDFOptions): Promise<void> {
  const el = document.getElementById(elementId);
  if (!el) throw new Error(`Element #${elementId} not found`);

  onProgress?.(10);

  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#FFFBEB',
    logging: false,
  });

  onProgress?.(60);

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // Header
  pdf.setFillColor(139, 92, 246);
  pdf.rect(0, 0, pageWidth, 22, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('SmartCare AI — Assessment Results', margin, 14);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text(new Date().toLocaleDateString('en-US', { dateStyle: 'long' }), pageWidth - margin, 14, { align: 'right' });

  onProgress?.(70);

  const imgHeight = (canvas.height * contentWidth) / canvas.width;
  let position = 26;

  if (imgHeight <= pageHeight - position - margin) {
    pdf.addImage(imgData, 'PNG', margin, position, contentWidth, imgHeight);
  } else {
    let srcY = 0;
    while (srcY < canvas.height) {
      const sliceH = Math.min(
        (canvas.width * (pageHeight - position - margin)) / contentWidth,
        canvas.height - srcY,
      );
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = sliceH;
      const ctx = pageCanvas.getContext('2d')!;
      ctx.drawImage(canvas, 0, srcY, canvas.width, sliceH, 0, 0, canvas.width, sliceH);
      if (srcY > 0) pdf.addPage();
      pdf.addImage(pageCanvas.toDataURL('image/png'), 'PNG', margin, position, contentWidth, (sliceH * contentWidth) / canvas.width);
      srcY += sliceH;
    }
  }

  onProgress?.(90);
  pdf.save(`${filename}.pdf`);
  onProgress?.(100);
}