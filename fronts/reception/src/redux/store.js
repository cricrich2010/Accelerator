import { configureStore } from '@reduxjs/toolkit'
import trialsReduxStoreReducer from './trialsSlice.js'

export default configureStore({
    reducer: {
        trials: trialsReduxStoreReducer,
    },
})