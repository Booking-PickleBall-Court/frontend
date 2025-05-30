import React, { useEffect, useState, useCallback } from 'react';
import { Typography, Box, CircularProgress } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { courtAPI } from '../services/api';
import SearchBar from '../components/SearchBar';
import CourtList from '../components/CourtList';

function Explore() {
    const [courts, setCourts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isSearching, setIsSearching] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const buildSearchParams = useCallback(() => {
        const params = new URLSearchParams(location.search);
        const result = {
            page: page - 1,
            size: 9,
        };

        const map = {
            where: 'address',
            minPrice: 'minPrice',
            maxPrice: 'maxPrice',
            date: 'date',
        };

        for (const [key, value] of Object.entries(map)) {
            const val = params.get(key)?.trim();
            if (val) {
                result[value] = val;
            }
        }

        return result;
    }, [location.search, page]);

    const searchCourts = useCallback(async (params) => {
        setIsSearching(true);
        try {
            setLoading(true);
            const response = await courtAPI.searchCourts(params);
            setCourts(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            setError('Failed to fetch courts');
        } finally {
            setLoading(false);
            setIsSearching(false);
        }
    }, []);

    useEffect(() => {
        searchCourts(buildSearchParams());
    }, [buildSearchParams, searchCourts]);

    const handleSearch = useCallback((searchParams) => {
        const params = new URLSearchParams();
        
        if (searchParams.address) params.set('where', searchParams.address);
        if (searchParams.minPrice) params.set('minPrice', searchParams.minPrice);
        if (searchParams.maxPrice) params.set('maxPrice', searchParams.maxPrice);
        if (searchParams.date) params.set('date', searchParams.date);

        setPage(1);
        navigate(`/explore?${params.toString()}`);
    }, [navigate]);

    if (loading && !isSearching) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
    }

    return (
        <div style={{ padding: 32 }}>
            <SearchBar onSearch={handleSearch} />

            {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

            <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
                Danh sách sân hiện có
            </Typography>

            {isSearching && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <CircularProgress />
                    <Typography sx={{ ml: 1 }}>Đang tìm kiếm...</Typography>
                </Box>
            )}

            <CourtList
                courts={courts}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />
        </div>
    );
}

export default Explore;