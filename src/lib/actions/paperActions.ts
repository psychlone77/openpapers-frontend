import { bioPaper } from "../constants/testBioPaper";
import { paper } from "../constants/testPaper";
import { PaperSchema } from "../types/paperSchema";

export default function getPaper(subject: string, year: string, type: string): PaperSchema | null {
  if (subject === "mathematics") {
    return paper;
  } else if (subject === "biology") {
    return bioPaper;
  } else {
    return null;
  }
}
