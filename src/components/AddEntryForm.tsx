import React, { useEffect, useState } from 'react';
import {
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Box,
    Stack,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { PortfolioEntry } from '../types/portfolio';
import { PORTFOLIO_TYPES, CURRENCIES, COUNTRIES } from '../utils/constants';

interface AddEntryFormProps {
    onSubmit?: (entry: PortfolioEntry) => void; // Renamed from onAddEntry
    onSuccess?: () => void; // Renamed from onEntryAdded
    onCancel?: () => void;
    accountId?: string; // Changed to optional and string
    entry?: PortfolioEntry | null;
    isEdit?: boolean;
    user?: { email?: string }; // Added user prop
}

export const AddEntryForm: React.FC<AddEntryFormProps> = ({
    onSubmit,
    onSuccess, // Renamed from onEntryAdded
    onCancel,
    accountId,
    entry,
    isEdit = false,
    user // Destructure user prop
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [formData, setFormData] = useState<Partial<PortfolioEntry>>({
        type: 'STOCK',
        currency: 'USD',
        amount: 0,
        country: 'Singapore',
        source: '',
        notes: '',
        dateAdded: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (entry) {
            setFormData({
                ...entry,
                dateAdded: entry.dateAdded.split('T')[0]
            });
        }
    }, [entry]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const entryData = {
            ...formData,
            id: entry?.id || '',
            accountId: accountId || '',
            dateAdded: formData.dateAdded ? `${formData.dateAdded}T00:00:00` : new Date().toISOString(),
        } as PortfolioEntry;

        if (onSubmit) {
            onSubmit(entryData);
        }
        if (onSuccess) {
            onSuccess();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev: Partial<PortfolioEntry>) => ({ ...prev, [name]: value }));
    };    return (
        <form onSubmit={handleSubmit}>
            <DialogTitle>
                {isEdit ? 'Edit Entry' : 'Add New Entry'}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 2 }}>
                    <Stack spacing={2}>
                        <Stack direction={isMobile ? "column" : "row"} spacing={2}>
                            <TextField
                                name="type"
                                select
                                label="Type"
                                value={formData.type || 'STOCK'}
                                onChange={handleChange}
                                fullWidth
                                required
                            >
                                {PORTFOLIO_TYPES.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type.replace('_', ' ')}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                name="dateAdded"
                                type="date"
                                label="Date"
                                value={formData.dateAdded}
                                onChange={handleChange}
                                fullWidth
                                required
                                InputLabelProps={{ shrink: true }}
                            />
                        </Stack>
                        <Stack direction={isMobile ? "column" : "row"} spacing={2}>
                            <TextField
                                name="currency"
                                select
                                label="Currency"
                                value={formData.currency || 'USD'}
                                onChange={handleChange}
                                fullWidth
                                required
                            >
                                {CURRENCIES.map((currency) => (
                                    <MenuItem key={currency} value={currency}>
                                        {currency}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                name="amount"
                                type="number"
                                label="Amount"
                                value={formData.amount || ''}
                                onChange={handleChange}
                                fullWidth
                                required
                                inputProps={{ step: "0.01" }}
                            />                        </Stack>
                        <Stack direction={isMobile ? "column" : "row"} spacing={2}>
                            <TextField
                                name="country"
                                select
                                label="Country"
                                value={formData.country || 'United States'}
                                onChange={handleChange}
                                fullWidth
                                required
                            >
                                {COUNTRIES.map((country) => (
                                    <MenuItem key={country} value={country}>
                                        {country}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                name="source"
                                label="Source"
                                value={formData.source || ''}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Stack>
                        <TextField
                            name="notes"
                            label="Notes"
                            value={formData.notes || ''}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={3}
                        />
                    </Stack>
                </Box>
            </DialogContent>            <DialogActions sx={{ flexDirection: isMobile ? "column" : "row", gap: isMobile ? 1 : 0, p: isMobile ? 2 : 1 }}>
                <Button onClick={onCancel} fullWidth={isMobile}>Cancel</Button>
                <Button type="submit" variant="contained" color="primary" fullWidth={isMobile}>
                    {isEdit ? 'Save Changes' : 'Add Entry'}
                </Button>
            </DialogActions>
        </form>
    );
};
