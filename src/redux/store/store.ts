import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slices/userSlice';
import agentReducer from '../slices/agentSlice';
import loadingReducer from '../slices/loadingSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    loading: loadingReducer,
    agent: agentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;