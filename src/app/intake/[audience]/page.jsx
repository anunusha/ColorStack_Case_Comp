import { notFound } from "next/navigation";
import IntakeFlow from "@/components/IntakeFlow";

const audienceLabels = {
  student: "Student",
  dtc: "Disability Tax Credit",
};

export default async function IntakePage({ params }) {
  const { audience } = await params;

  if (!audienceLabels[audience]) {
    notFound();
  }

  return <IntakeFlow audience={audience} />;
}
