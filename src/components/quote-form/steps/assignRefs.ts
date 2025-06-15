
/**
 * Utilitaire pour combiner plusieurs refs sur un seul élément.
 */
export function assignRefs<T>(...refs: any[]) {
  return (el: T | null) => {
    refs.forEach(ref => {
      if (typeof ref === "function") ref(el);
      else if (ref && typeof ref === "object") ref.current = el;
    });
  };
}
