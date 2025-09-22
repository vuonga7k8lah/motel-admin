import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../redux/store';
import { useKeycloak } from '@react-keycloak/web';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { keycloak, initialized } = useKeycloak();

  if (!initialized) {
    return <div>Loading...</div>;
  }
  return keycloak.authenticated ? (
    <>{children}</>
  ) : (
    <button type="button" onClick={() => keycloak.login()}>
      Login
    </button>
  );
  // const isAuthenticated = useSelector(
  //     (state: RootState) => state.auth.isAuthenticated
  // );

  // return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
