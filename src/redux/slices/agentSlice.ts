import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AgentState, IAgent } from '../../types/agent';

const initialState: AgentState = {
  allAgents: [],
  loading: false,
  error: null,
};

const agentSlice = createSlice({
  name: 'agent',
  initialState,
  reducers: {
    setAllAgents: (state, action: PayloadAction<IAgent[]>) => {
      state.allAgents = action.payload;
    },
    addAgent: (state, action: PayloadAction<IAgent>) => {
      state.allAgents.push(action.payload);
    },
    removeAgent: (state, action: PayloadAction<string>) => {
      state.allAgents = state.allAgents.filter(
        agent => agent._id !== action.payload
      );
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearAgents: (state) => {
      state.allAgents = [];
      state.error = null;
    },
  },
});

export const {
  setAllAgents,
  addAgent,
  removeAgent,
  setLoading,
  setError,
  clearAgents,
} = agentSlice.actions;

export default agentSlice.reducer;