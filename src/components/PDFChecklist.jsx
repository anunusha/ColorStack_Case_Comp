"use client";

import jsPDF from "jspdf";

function getAudienceLabel(audience) {
  return audience === "dtc" ? "Disability Tax Credit pathway" : "Student pathway";
}

function getExplanation(credit) {
  return credit.plain_english_explanation ?? credit.fallback_explanation ?? "";
}

function getEstimate(credit) {
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

  return "Not estimated";
}

export function generatePDF(audience, eligibleCredits = []) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const left = 16;
  const right = pageWidth - 16;
  const maxWidth = right - left;
  let y = 20;

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

    doc.setFont("helvetica", weight);
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(String(text || ""), max - indent);
    ensureSpace(lines.length * spacing + 2);
    doc.text(lines, left + indent, y);
    y += lines.length * spacing;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Your TaxBridge Checklist", left, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-CA")}`, left, y);
  y += 6;
  doc.text(`Audience: ${getAudienceLabel(audience)}`, left, y);
  y += 10;

  if (eligibleCredits.length === 0) {
    writeLine("No matched credits yet. Retake intake and review your answers.", {
      size: 12,
      weight: "bold",
      spacing: 7,
    });
  } else {
    eligibleCredits.forEach((credit, index) => {
      ensureSpace(28);
      writeLine(`${index + 1}. ${credit.name ?? "Untitled credit"}`, {
        size: 13,
        weight: "bold",
        spacing: 7,
      });
      writeLine(`Estimated value: ${getEstimate(credit)}`, { spacing: 6 });
      writeLine(getExplanation(credit), { spacing: 6 });
      writeLine(`Where it goes: ${credit.filing_destination ?? "Not specified"}`, {
        spacing: 6,
      });

      const documents = Array.isArray(credit.documents_needed)
        ? credit.documents_needed
        : [];
      if (documents.length > 0) {
        writeLine("Documents to gather:", { weight: "bold", spacing: 6 });
        documents.forEach((document) => {
          writeLine(`- ${document}`, { indent: 3, spacing: 6 });
        });
      } else {
        writeLine("Documents to gather: Not specified", { spacing: 6 });
      }

      y += 3;
    });
  }

  ensureSpace(26);
  writeLine("Free filing options:", { size: 12, weight: "bold", spacing: 7 });
  writeLine("- CRA-certified free tax clinics (CVITP) during tax season.", {
    spacing: 6,
  });
  writeLine("- Campus student tax clinics if available at your school.", {
    spacing: 6,
  });
  writeLine(
    "- TaxBridge is educational guidance only and not tax, legal, or financial advice.",
    { spacing: 6 }
  );

  doc.save("taxbridge-checklist.pdf");
}
