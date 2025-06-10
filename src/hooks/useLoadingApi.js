import { useLoading } from '../contexts/LoadingContext';

export const useLoadingApi = () => {
  const { setIsLoading } = useLoading();

  const withLoading = async (promise) => {
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