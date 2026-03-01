import { useEffect, useState } from "react";

const DEFAULT_ANIMATION_MS = 550;

/**
 * Caches an entity (e.g. employee, activity, task) while a sheet or dialog is animating out.
 * When the sheet closes, the parent typically sets the selected entity to `null`.
 * If the sheet component immediately returns `null`, the Radix exit animation is aborted.
 *
 * This hook retains the last known non-null entity for the duration of the exit animation,
 * allowing the sheet's content to stay rendered as it slides/fades out.
 */
export function useEntityCache<T>(
  entity: T | null,
  isOpen: boolean,
  animationMs = DEFAULT_ANIMATION_MS,
): T | null {
  const [cachedEntity, setCachedEntity] = useState<T | null>(null);

  useEffect(() => {
    if (entity) {
      const timeOutId = setTimeout(() => {
        setCachedEntity(entity);
      }, 0);

      return () => clearTimeout(timeOutId);
    }
  }, [entity]);

  useEffect(() => {
    if (!isOpen && cachedEntity) {
      const timeoutId = setTimeout(() => setCachedEntity(null), animationMs);
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen, cachedEntity, animationMs]);

  return entity ?? cachedEntity;
}
