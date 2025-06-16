import { PaperSchema } from "../types/paperSchema";

export default async function getPaper(
  subject: string,
  year: string,
  type: string
): Promise<PaperSchema | null> {
  try {
    const res = await fetch(
      `http://localhost:5000/papers?subject=${subject}&year=${year}&type=${type}`,
      {
        cache: "force-cache",
      }
    );
    const data = await res.json();
    if (data && data.length > 0) {
      return data[0] as PaperSchema; // Assuming the first paper matches the criteria
    } else {
      return null; // No paper found
    }
  } catch (error) {
    console.error("Error fetching paper:", error);
    return null; // Return null in case of an error
  }
}
