import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
    Card, CardContent, Typography, Grid, CardActionArea,
    CircularProgress, Box, Pagination
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { courtAPI } from '../services/api';
import SearchBar from '../components/SearchBar';

function Explore() {
    const [courts, setCourts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const searchTimeoutRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [isSearching, setIsSearching] = useState(false);

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
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = setTimeout(() => {
            searchCourts(buildSearchParams());
        }, 300);

        return () => {
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        };
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

    const handleCourtClick = useCallback((courtId) => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        navigate(user.id ? `/courts/${courtId}` : '/login');
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

            <Grid container spacing={3}>
                {courts.map((court) => (
                    <Grid item xs={12} sm={6} md={4} key={court.id}>
                        <Card>
                            <CardActionArea onClick={() => handleCourtClick(court.id)}>
                                <CardContent>
                                    <Typography variant="h6">{court.name}</Typography>
                                    <Typography color="text.secondary">Địa chỉ: {court.address}</Typography>
                                    <Typography color="text.secondary">Giá: ${court.hourlyPrice}/giờ</Typography>
                                    <Typography color="text.secondary">Loại sân: {court.courtType}</Typography>
                                    <Typography color="text.secondary">Trạng thái: {court.status}</Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(e, value) => setPage(value)}
                        color="primary"
                    />
                </Box>
            )}
        </div>
    );
}

export default Explore;