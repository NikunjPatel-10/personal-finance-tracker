import { UserManager, WebStorageStateStore } from 'oidc-client';
import {
  acrValues,
  clientId,
  clientRoot,
  clientScope,
  logoutUrl,
  setAuthority,
} from '../../../environments/environment';
import { setToken } from '../../../features/auth/auth';
import { store } from '../../../store/store';

export const userManager = new UserManager({
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  authority: setAuthority,
  client_id: clientId,
  redirect_uri: clientRoot,
  response_type: 'id_token token',
  scope: clientScope,
  post_logout_redirect_uri: logoutUrl,
  client_secret: 'secret1',
  acr_values: acrValues,
});

export const getUser = () => {
  return userManager.getUser();
};
export const clearUser = () => {
  userManager.removeUser();
};
export const login = () => {
  userManager.signinRedirect().catch((error) => {
    console.error('Sign-in redirect error:', error);
  });
};

export const signOut = async () => {
  await userManager.signoutRedirect().then(() => {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie = '';
  });
};

export const afterLogin = async () => {
  const user = await userManager.signinRedirectCallback();
  store.dispatch(setToken(user.profile));
  localStorage.setItem('token', user.access_token);
  localStorage.setItem('role', user.profile.role);
  return user;
};

export const renewToken = () => {
  return userManager.signinSilent();
};

export const logout = () => {
  return userManager.signoutRedirect();
};
