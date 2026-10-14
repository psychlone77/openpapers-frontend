import { PaperSchema } from "../types/paperSchema";
import { paper } from "../constants/testPaper";

export default async function getPaper(
  subject: string,
  year: string,
  type: string
): Promise<PaperSchema | null> {
  console.log(`Fetching paper for subject: ${subject}, year: ${year}, type: ${type}`);
  // Simulate an API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return paper;
}
