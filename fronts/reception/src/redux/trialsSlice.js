import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    trials: [
        { id: 0, name: 'trials_fake_00', description: 'bidon trial description' },
        { id: 0, name: 'trials_fake_01', description: 'bidon trial description' },
        { id: 0, name: 'trials_fake_01', description: 'bidon trial description' },
    ]
};

let nextId = 4
export const trialsSlice = createSlice({
    name: 'trialsSlice',
    initialState,

    reducers: {
        addTrialReduxStore: (state, action) => {
            console.log('in')
            state.trials = [...state.items, { id: nextId, name: action.payload.name }]
            nextId += 1
        },
        removeTrialReduxStore: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload.id)
        },
    },
});

export const { addTrialReduxStore, removeTrialReduxStore } = trialsSlice.actions;

export const selectItems = (state) => state.trialsSlice.trials;

export default trialsSlice.reducer;

