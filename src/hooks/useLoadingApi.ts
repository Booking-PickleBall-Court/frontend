import { useLoading } from '../contexts/LoadingContext';

export const useLoadingApi = () => {
  const { setIsLoading } = useLoading();

  const withLoading = async <T>(promise: Promise<T>): Promise<T> => {
    try {
      setIsLoading(true);
      const result = await promise;
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  return { withLoading };
}; 