import React, { useState, createContext } from 'react';
import {
  checkNotifications,
  requestNotifications,
  RESULTS,
} from 'react-native-permissions';

type PermissionsContextProps = {
  notificationsPermissions: any;
  askNotificationsPermission: () => void;
};

export const PermissionsContext = createContext({} as PermissionsContextProps);

export const PermissionsProvider = ({ children }: any) => {
  const [notificationsPermissions, setNotificationsPermissions] = useState({});

  const askNotificationsPermission = async () => {
    checkNotifications().then(({ status }) => {
      if (status === RESULTS.BLOCKED || status === RESULTS.DENIED) {
        requestNotifications(['alert']).then(({ status }) => {
          setNotificationsPermissions(status);
        });
      } else {
        setNotificationsPermissions(status);
      }
    });
  };

  return (
    <PermissionsContext.Provider
      value={{
        notificationsPermissions,
        askNotificationsPermission,
      }}>
      {children}
    </PermissionsContext.Provider>
  );
};
