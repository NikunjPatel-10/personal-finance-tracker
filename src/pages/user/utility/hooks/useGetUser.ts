import { useEffect } from 'react';
import { setUser } from '../../../../features/auth/auth';
import { useAppDispatch } from '../../../../store/store';
import { useLazyGetUserQuery } from '../services/user.service';

export function useGetUser() {
  const subjectId = localStorage.getItem('subjectId');
  const [getUserTrigger] = useLazyGetUserQuery();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (subjectId) {
      getUserTrigger(subjectId).then((res) => {
        dispatch(setUser(res.data.data));
      });
    }
  }, []);
}
