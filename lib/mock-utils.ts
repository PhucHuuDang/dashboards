// @/lib/mock-utils.ts
export function paginate<T>(data: T[], page: number, perPage: number) {
  const offset = (page - 1) * perPage;
  return data.slice(offset, offset + perPage);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sortData<T extends Record<string, any>>(
  data: T[],
  sort: { id: keyof T; desc: boolean }[]
) {
  if (!sort.length) return data;

  return [...data].sort((a, b) => {
    for (const s of sort) {
      const v1 = a[s.id];
      const v2 = b[s.id];

      if (v1 < v2) return s.desc ? 1 : -1;
      if (v1 > v2) return s.desc ? -1 : 1;
    }
    return 0;
  });
}
