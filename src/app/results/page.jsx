import { Suspense } from "react";

import ResultsPage from "@/components/ResultsPage";

export default function Results() {
  return (
    <Suspense fallback={null}>
      <ResultsPage />
    </Suspense>
  );
}
