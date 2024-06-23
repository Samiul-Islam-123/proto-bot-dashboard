import React, { useEffect } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

const PrivateRoute = ({ element, ...rest }) => {
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = '/sign-in'; // Redirect to the sign-in page if not authenticated
    }
  }, [isLoading, user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return user ? <Route {...rest} element={element} /> : <Navigate to="/sign-in" replace />;
};

export default PrivateRoute;
