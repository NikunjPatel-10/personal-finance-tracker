import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setSubjectId } from '../../../features/auth/auth';
import { useAppDispatch } from '../../../store/store';
import { userManager } from '../../utility/services/auth-service';

function AuthCallback() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  useEffect(() => {
    async function handleAfterLogin() {
      try {
        userManager.signinRedirectCallback().then((user) => {
          localStorage.setItem('token', user.access_token);
          localStorage.setItem('role', user.profile.role);
          localStorage.setItem('profile', JSON.stringify(user.profile));
          localStorage.setItem('subjectId', user.profile.sub);

          if (user.profile.sub) {
            dispatch(setSubjectId(user.profile.sub));
          }
          navigate('/');
        });
      } catch (error) {
        console.error(error);
      }
    }
    if (!localStorage.getItem('token')) {
      handleAfterLogin();
    }
  }, []);

  return <div>Loading...</div>;
}

export default AuthCallback;
