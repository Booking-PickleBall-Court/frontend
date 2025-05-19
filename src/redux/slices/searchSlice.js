import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    searchParams: {
        address: '',
        date: null,
        minPrice: '',
        maxPrice: '',
    },
    results: [],
    loading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchParams: (state, action) => {
            state.searchParams = { ...state.searchParams, ...action.payload };
        },
        setSearchResults: (state, action) => {
            state.results = action.payload.content;
            state.totalPages = action.payload.totalPages;
            state.currentPage = action.payload.currentPage;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        resetSearch: (state) => {
            return initialState;
        },
    },
});

export const {
    setSearchParams,
    setSearchResults,
    setLoading,
    setError,
    resetSearch,
} = searchSlice.actions;

export default searchSlice.reducer; 