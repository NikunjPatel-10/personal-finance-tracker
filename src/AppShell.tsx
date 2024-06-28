import { Notifications } from '@mantine/notifications';
import { useSelector } from 'react-redux';
import { AuthInterceptor } from './core/utility/services/Interceptor';
import { LoaderWrapper } from './shared/components/Loader';

function AppShell() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isLoading = useSelector((state: any) => state.loader.isLoading);
  return (
    <>
      <Notifications position="top-right" zIndex={1000} />
      {isLoading && <LoaderWrapper />}
      <AuthInterceptor />
    </>
  );
}

export default AppShell;
