import { useState, useEffect } from "react";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Pass any API function + its arguments, get back data/loading/error
export const useYoutube = <T>(
  apiFn: (...args: any[]) => Promise<T>,
  ...args: any[]
): FetchState<T> => {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Skip if no args provided
    if (args.some((arg) => !arg)) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    setState({ data: null, loading: true, error: null });

    apiFn(...args)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err: Error) =>
        setState({ data: null, loading: false, error: err.message })
      );
  }, [JSON.stringify(args)]); // re-runs when args change

  return state;
};