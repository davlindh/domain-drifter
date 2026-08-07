import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "domain-navigator:particle-values";

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
};

/**
 * Particle values are per domain + perspective. The `domains` table only stores
 * name/description, so these annotations live in local storage.
 */
export const useParticleValues = () => {
  const [values, setValues] = useState(read);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    } catch {
      /* storage unavailable — keep values in memory only */
    }
  }, [values]);

  const getValues = useCallback(
    (domainId, perspective) => values?.[domainId]?.[perspective] ?? {},
    [values],
  );

  const saveValues = useCallback((domainId, perspective, next) => {
    setValues((prev) => ({
      ...prev,
      [domainId]: { ...prev[domainId], [perspective]: next },
    }));
  }, []);

  const removeDomain = useCallback((domainId) => {
    setValues((prev) => {
      const next = { ...prev };
      delete next[domainId];
      return next;
    });
  }, []);

  return { getValues, saveValues, removeDomain };
};
