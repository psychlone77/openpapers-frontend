"use server";

import {
  fetchSubjectYears,
  fetchSubjectPapers,
  fetchSubjects,
  fetchExams,
  resolveSubjectId,
  resolveSubjectName,
} from "@/lib/api/curriculum";

export async function getSubjectYearsAction(subjectIdOrName: string): Promise<number[]> {
  return await fetchSubjectYears(subjectIdOrName);
}

export async function getSubjectPapersAction(subjectIdOrName: string, year?: number | string) {
  return await fetchSubjectPapers(subjectIdOrName, year);
}

export async function getSubjectsAction(stream?: string) {
  return await fetchSubjects(stream);
}

export async function getExamsAction() {
  return await fetchExams();
}

export { resolveSubjectId, resolveSubjectName };
