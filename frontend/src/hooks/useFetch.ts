import { useState, useCallback } from 'react';
import api from '@/lib/api';


export const useFetch = <T,>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<T>(url);
      setData(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  }, [url]);

  return { data, loading, error, fetchData };
};
