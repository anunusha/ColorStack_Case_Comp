"use client";

import jsPDF from "jspdf";

function defaultT(key) {
  return key;
}

async function loadHindiFont(doc) {
  const response = await fetch("/fonts/NotoSansDevanagari-Regular.ttf");
  if (!response.ok) {
    throw new Error(`Font fetch failed: ${response.status}`);
  }
  const buffer = await response.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  doc.addFileToVFS("NotoSansDevanagari-Regular.ttf", base64);
  doc.addFont("NotoSansDevanagari-Regular.ttf", "NotoSansHi", "normal");
}

function hasHindiFont(doc) {
  return Boolean(doc.getFontList()?.NotoSansHi);
}

function getExplanation(credit) {
  return credit.plain_english_explanation ?? credit.fallback_explanation ?? "";
}

function getEstimate(credit, tr) {
  if (credit.computed_estimate?.display) {
    return credit.computed_estimate.display;
  }

  if (typeof credit.estimated_dollars === "number") {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0,
    }).format(credit.estimated_dollars);
  }

  return tr("pdf.not_estimated");
}

/**
 * @param {"student"|"dtc"|undefined} audience
 * @param {Array<object>} eligibleCredits
 * @param {"en"|"hi"} lang
 * @param {(key: string, vars?: Record<string, string | number>) => string} [t]
 */
export async function generatePDF(audience, eligibleCredits = [], lang = "en", t = defaultT) {
  const tr = typeof t === "function" ? t : defaultT;
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const left = 16;
  const right = pageWidth - 16;
  const maxWidth = right - left;
  let y = 20;

  const wantHindiFont = lang === "hi";

  if (wantHindiFont) {
    try {
      await loadHindiFont(doc);
    } catch (error) {
      console.warn("Hindi font unavailable; falling back to Helvetica.", error);
    }
  }

  function applyFont(weight = "normal", size = 11) {
    if (wantHindiFont && hasHindiFont(doc)) {
      doc.setFont("NotoSansHi", "normal");
      doc.setFontSize(weight === "bold" ? Math.min(size + 1, 18) : size);
      return;
    }

    doc.setFont("helvetica", weight === "bold" ? "bold" : "normal");
    doc.setFontSize(size);
  }

  function ensureSpace(requiredHeight = 12) {
    if (y + requiredHeight > 280) {
      doc.addPage();
      y = 20;
    }
  }

  function writeLine(text, options = {}) {
    const {
      size = 11,
      weight = "normal",
      indent = 0,
      spacing = 6,
      max = maxWidth,
    } = options;

    applyFont(weight, size);
    const lines = doc.splitTextToSize(String(text || ""), max - indent);
    ensureSpace(lines.length * spacing + 2);
    doc.text(lines, left + indent, y);
    y += lines.length * spacing;
  }

  const audienceLabel =
    audience === "dtc" ? tr("pdf.audience.dtc") : tr("pdf.audience.student");

  applyFont("bold", 18);
  doc.text(tr("pdf.title"), left, y);
  y += 8;

  applyFont("normal", 11);
  doc.text(`${tr("pdf.generated")} ${new Date().toLocaleDateString("en-CA")}`, left, y);
  y += 6;
  doc.text(`${tr("pdf.audience")} ${audienceLabel}`, left, y);
  y += 10;

  if (eligibleCredits.length === 0) {
    writeLine(tr("pdf.no_credits"), {
      size: 12,
      weight: "bold",
      spacing: 7,
    });
  } else {
    eligibleCredits.forEach((credit, index) => {
      ensureSpace(28);
      writeLine(`${index + 1}. ${credit.name ?? tr("pdf.untitled_credit")}`, {
        size: 13,
        weight: "bold",
        spacing: 7,
      });
      writeLine(`${tr("pdf.estimated_value")} ${getEstimate(credit, tr)}`, { spacing: 6 });
      writeLine(getExplanation(credit), { spacing: 6 });
      writeLine(`${tr("pdf.where_it_goes")} ${credit.filing_destination ?? tr("pdf.not_specified")}`, {
        spacing: 6,
      });

      const documents = Array.isArray(credit.documents_needed) ? credit.documents_needed : [];
      if (documents.length > 0) {
        writeLine(tr("pdf.documents_heading"), { weight: "bold", spacing: 6 });
        documents.forEach((document) => {
          writeLine(`- ${document}`, { indent: 3, spacing: 6 });
        });
      } else {
        writeLine(tr("pdf.documents_none"), { spacing: 6 });
      }

      y += 3;
    });
  }

  ensureSpace(26);
  writeLine(tr("pdf.free_filing"), { size: 12, weight: "bold", spacing: 7 });
  writeLine(tr("pdf.free_filing.cvitp"), {
    spacing: 6,
  });
  writeLine(tr("pdf.free_filing.campus"), {
    spacing: 6,
  });
  writeLine(tr("pdf.free_filing.disclaimer"), { spacing: 6 });

  doc.save("taxbridge-checklist.pdf");
}
