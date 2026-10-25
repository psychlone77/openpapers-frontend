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
  const subjects = await fetchSubjects();
  return await fetchSubjectYears(subjectIdOrName, subjects);
}

export async function getSubjectPapersAction(subjectIdOrName: string, year?: number | string) {
  const subjects = await fetchSubjects();
  return await fetchSubjectPapers(subjectIdOrName, year, subjects);
}

export async function getSubjectsAction(stream?: string) {
  return await fetchSubjects(stream);
}

export async function getExamsAction() {
  return await fetchExams();
}

export { resolveSubjectId, resolveSubjectName };
