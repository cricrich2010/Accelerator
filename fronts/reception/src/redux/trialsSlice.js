import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    trials: [
        { id: 0, name: 'trials_fake_00', description: 'bidon trial description' },
        { id: 1, name: 'trials_fake_01', description: 'bidon trial description' },
        { id: 2, name: 'trials_fake_01', description: 'bidon trial description' },
    ],
    count: 3
};

let nextId = 4
export const ObjSlice_Trials = createSlice({
    name: 'trials',
    initialState,

    reducers: {
        addTrialReduxStore: (state, action) => {
            console.log('in')
            state.trials = [...state.trials, { id: nextId, name: action.payload.name, description: action.payload.description }]
            state.count += 1
        },
        removeTrialReduxStore: (state, action) => {
            state.trials = state.trials.filter(item => item.id !== action.payload)
            state.count -= 1
        },
        clearTrialsReduxStore: (state) => {
            state.trials = []
            state.count = 0
        },
    },
});

export const { addTrialReduxStore, removeTrialReduxStore, clearTrialReduxStore } = ObjSlice_Trials.actions;

export const getTrialsTrialsReduxStore = (state) => state.trials.trials;
export const getTrialsCountReduxStore = (state) => state.trials.count;


export default ObjSlice_Trials.reducer;

