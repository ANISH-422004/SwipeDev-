import React, { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { addUser } from '@/app/slices/userSlice';
import LoadingScreen from './LoadingScreen';

const Protected = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user); // ✅ check user from Redux
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You are not authorized to access this page.');
      return navigate('/login');
    }

    // ✅ Skip API call if user already exists in Redux
    if (user) {
      setLoading(false);
      return;
    }

    axiosInstance
      .get('/api/v1/users/profile')
      .then((res) => {
        dispatch(addUser(res.data.user));
      })
      .catch((err) => {
        console.error(err);
        toast.error('You are not authorized to access this page.');
        navigate('/login');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch, navigate, user]);

  if (loading) return <LoadingScreen />;

  return children;
};

export default Protected;
