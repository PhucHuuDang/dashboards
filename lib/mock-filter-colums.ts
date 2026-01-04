import type { ExtendedColumnFilter, JoinOperator } from "@/types/data-table";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function applyColumnFilters<T extends Record<string, any>>({
  data,
  filters,
  joinOperator,
}: {
  data: T[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filters: ExtendedColumnFilter<any>[];
  joinOperator: JoinOperator;
}): T[] {
  if (!filters.length) return data;

  return data.filter((row) => {
    const results = filters.map((filter) => {
      const value = row[filter.id];

      console.log({ filter });

      switch (filter.operator) {
        case "iLike":
          return (
            typeof value === "string" &&
            typeof filter.value === "string" &&
            value.toLowerCase().includes(filter.value.toLowerCase())
          );

        case "notILike":
          return (
            typeof value === "string" &&
            typeof filter.value === "string" &&
            !value.toLowerCase().includes(filter.value.toLowerCase())
          );

        case "eq":
          if (filter.variant === "date") {
            return (
              new Date(value).toDateString() ===
              new Date(Number(filter.value)).toDateString()
            );
          }
          return value === filter.value;

        case "ne":
          return value !== filter.value;

        case "inArray":
          return Array.isArray(filter.value)
            ? filter.value.includes(value)
            : true;

        case "notInArray":
          return Array.isArray(filter.value)
            ? !filter.value.includes(value)
            : true;

        case "lt":
          return value < filter.value;

        case "lte":
          return value <= filter.value;

        case "gt":
          return value > filter.value;

        case "gte":
          return value >= filter.value;

        case "isBetween":
          if (Array.isArray(filter.value)) {
            const [min, max] = filter.value;
            return (min ? value >= min : true) && (max ? value <= max : true);
          }
          return true;

        case "isEmpty":
          return value === null || value === undefined || value === "";

        case "isNotEmpty":
          return !(value === null || value === undefined || value === "");

        default:
          return true;
      }
    });

    return joinOperator === "and"
      ? results.every(Boolean)
      : results.some(Boolean);
  });
}
