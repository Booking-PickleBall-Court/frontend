import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courtAPI, courtSlotAPI } from '../services/api';
import {
    Container, Typography, Box, Grid, Button, Alert, Card, CardContent, Divider
} from '@mui/material';
import { format } from 'date-fns';

function CourtDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [court, setCourt] = useState(null);
    const [slots, setSlots] = useState([]);
    const [error, setError] = useState('');
    const [selectedSlot, setSelectedSlot] = useState(null);

    useEffect(() => {
        fetchCourt();
        fetchSlots();
    }, [id]);

    const fetchCourt = async () => {
        try {
            const res = await courtAPI.getCourtById(id);
            setCourt(res.data);
        } catch (err) {
            setError('Failed to load court info');
        }
    };

    const fetchSlots = async () => {
        try {
            const res = await courtSlotAPI.getCourtSlotsByCourt(id);
            setSlots(res.data);
        } catch (err) {
            setError('Failed to load court slots');
        }
    };

    const handleBook = () => {
        if (!selectedSlot) return;
        navigate(`/payment?slotId=${selectedSlot.id}`);
    };

    const isSlotAvailable = (slot) => slot && slot.status === 'AVAILABLE';

    const handleSlotClick = (slot) => {
        if (isSlotAvailable(slot)) {
            setSelectedSlot(slot);
        }
    };

    if (!court) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 4 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {/* Tiêu đề trang */}
                <Box display="flex" justifyContent="center" mb={4}>
                    <Typography variant="h4" fontWeight="bold">
                        {court.name}
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {/* Thông tin chi tiết về sân */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    Thông tin sân
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                <Typography>📍 <strong>Địa chỉ:</strong> {court.address}</Typography>
                                <Typography>💰 <strong>Giá theo giờ:</strong> ${court.hourlyPrice}</Typography>
                                <Typography>🏸 <strong>Loại sân:</strong> {court.courtType}</Typography>
                                <Typography>🔄 <strong>Trạng thái:</strong> {court.status}</Typography>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6">Mô tả:</Typography>
                                <Typography variant="body1">{court.description}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Danh sách khung giờ dạng Grid */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    Khung giờ có sẵn
                                </Typography>
                                <Grid container spacing={2} sx={{ maxHeight: 300, overflowY: 'auto' }}>
                                    {slots.map((slot) => (
                                        <Grid item xs={6} md={4} key={slot.id}>
                                            <Button
                                                fullWidth
                                                variant={selectedSlot?.id === slot.id ? 'contained' : 'outlined'}
                                                color={isSlotAvailable(slot) ? 'success' : 'default'}
                                                onClick={() => handleSlotClick(slot)}
                                                sx={{
                                                    textAlign: 'center',
                                                    fontWeight: 'bold',
                                                    py: 1,
                                                }}
                                            >
                                                {format(new Date(slot.startTime), 'MMM dd, yyyy hh:mm a')}
                                            </Button>
                                        </Grid>
                                    ))}
                                </Grid>

                                {/* Nút đặt lịch */}
                                {selectedSlot && (
                                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleBook}
                                            disabled={!isSlotAvailable(selectedSlot)}
                                            sx={{ fontWeight: 'bold', width: '50%' }}
                                        >
                                            Đặt lịch ngay
                                        </Button>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}

export default CourtDetail;