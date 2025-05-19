import React, { useState, useCallback } from 'react';
import {
  Paper,
  TextField,
  Button,
  InputAdornment,
  Typography,
  Box,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parseISO, startOfDay } from 'date-fns';

function SearchBar({ onSearch }) {
  const [searchParams, setSearchParams] = useState({
    address: '',
    date: null,
    minPrice: '',
    maxPrice: '',
  });

  const [errors, setErrors] = useState({});

  const validateParams = useCallback((params) => {
    const newErrors = {};

    if (params.minPrice && params.maxPrice &&
      Number(params.minPrice) > Number(params.maxPrice)) {
      newErrors.priceRange = 'Giá tối thiểu không thể lớn hơn giá tối đa';
    }

    if (params.date) {
      const today = startOfDay(new Date());
      const selectedDate = startOfDay(new Date(params.date));
      
      if (selectedDate < today) {
        newErrors.date = 'Không thể chọn ngày trong quá khứ';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    if (!validateParams(searchParams)) {
      return;
    }

    if (onSearch) {
      const filteredParams = Object.entries(searchParams).reduce((acc, [key, value]) => {
        if (value !== null && value !== '' && value !== undefined) {
          if (key === 'date' && value) {
            // Format date to YYYY-MM-DD in local timezone
            const date = startOfDay(new Date(value));
            acc[key] = format(date, 'yyyy-MM-dd');
          } else {
            acc[key] = value;
          }
        }
        return acc;
      }, {});
      onSearch(filteredParams);
    }
  };

  const handleChange = (field) => (event) => {
    let value = event.target.value;
    if (field === 'minPrice' || field === 'maxPrice') {
      value = value === '' ? '' : Math.max(0, Number(value));
    }

    setSearchParams(prev => {
      const newParams = { ...prev, [field]: value };
      validateParams(newParams);
      return newParams;
    });
  };

  const handleDateChange = (newValue) => {
    setSearchParams(prev => {
      const newParams = { ...prev, date: newValue };
      validateParams(newParams);
      return newParams;
    });
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 8,
        maxWidth: 1000,
        mx: 'auto',
        mt: 4,
        position: 'relative',
        zIndex: 2,
      }}
    >
      {/* Tầng 1: Tiêu đề */}
      <Box display="flex" justifyContent="center" mb={2}>
        <Typography variant="h6">Tìm kiếm sân</Typography>
      </Box>

      <form onSubmit={handleSearch}>
        {/* Tầng 2: Các tiêu chí tìm kiếm */}
        <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap" mb={2}>
          <TextField
            label="Địa chỉ"
            placeholder="Nhập địa chỉ"
            value={searchParams.address}
            onChange={handleChange('address')}
            size="small"
            sx={{ width: 240 }}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Ngày"
              value={searchParams.date}
              onChange={handleDateChange}
              slotProps={{
                textField: {
                  size: 'small',
                  error: !!errors.date,
                  helperText: errors.date,
                },
              }}
              minDate={startOfDay(new Date())}
            />
          </LocalizationProvider>
          <TextField
            label="Giá tối thiểu"
            type="number"
            value={searchParams.minPrice}
            onChange={handleChange('minPrice')}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            size="small"
            error={!!errors.priceRange}
            helperText={errors.priceRange}
            sx={{ width: 120 }}
          />
          <TextField
            label="Giá tối đa"
            type="number"
            value={searchParams.maxPrice}
            onChange={handleChange('maxPrice')}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            size="small"
            error={!!errors.priceRange}
            sx={{ width: 120 }}
          />
        </Box>

        {/* Tầng 3: Nút tìm kiếm */}
        <Box display="flex" justifyContent="center">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<SearchIcon />}
            size="large"
            sx={{ width: 200 }}
          >
            Tìm kiếm
          </Button>
        </Box>
      </form>
    </Paper>
  );
}

export default SearchBar;