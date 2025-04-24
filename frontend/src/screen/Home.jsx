import { addFeed } from '@/app/slices/feedSlice';
import axiosInstance from '@/lib/axiosInstance';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SwipeDeck from '@/components/SwipeDeck'; // adjust path if needed

const Home = () => {
  const dispatch = useDispatch();
  const feed = useSelector((state) => state.feed);

  const getFeed = async () => {
    if (feed && feed.length > 0) return;
    try {
      const res = await axiosInstance.get(`/api/v1/connections/feed`);
      dispatch(addFeed(res.data.users));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Swipe People</h1>
      {feed && feed.length > 0 ? (
        <SwipeDeck users={feed} />
      ) : (
        <p className="text-center text-gray-500">No New Users For You on Feed </p>
      )}
    </div>
  );
};

export default Home;
