import React from 'react';
import { Dialog, Fab, Zoom } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { AddEntryForm } from './AddEntryForm';

interface EntryDialogsProps {
    user: boolean;
    isAddDialogOpen: boolean;
    setIsAddDialogOpen: (open: boolean) => void;
    isEditDialogOpen: boolean;
    setIsEditDialogOpen: (open: boolean) => void;
    selectedEntry: any;
    loadData: () => void;
    setSelectedEntry: (entry: any | null) => void;
    handleAddEntry: (entry: any) => void; // Add handleAddEntry as a prop
}

export const EntryDialogs: React.FC<EntryDialogsProps> = ({
    user,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    selectedEntry,
    loadData,
    setSelectedEntry,
    handleAddEntry // Destructure handleAddEntry
}) => (
    <>
        {/* Add Entry Button */}
        {user && (
            <Zoom in={true}>
                <Fab 
                    color="primary" 
                    aria-label="add entry" 
                    sx={{ position: 'fixed', bottom: 16, right: 16 }} 
                    onClick={() => setIsAddDialogOpen(true)}
                >
                    <AddIcon />
                </Fab>
            </Zoom>
        )}

        {/* Add Entry Dialog */}
        <Dialog
            open={isAddDialogOpen}
            onClose={() => setIsAddDialogOpen(false)}
            maxWidth="sm"
            fullWidth
        >
            <AddEntryForm 
                onSubmit={handleAddEntry} 
                onSuccess={() => {
                    loadData();
                    setIsAddDialogOpen(false);
                }} 
                onCancel={() => setIsAddDialogOpen(false)} 
            />
        </Dialog>

        {/* Edit Entry Dialog */}
        <Dialog
            open={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            maxWidth="sm"
            fullWidth
        >
            <AddEntryForm 
                entry={selectedEntry} 
                onSuccess={() => {
                    loadData();
                    setIsEditDialogOpen(false);
                    setSelectedEntry(null);
                }} 
                onCancel={() => {
                    setIsEditDialogOpen(false);
                    setSelectedEntry(null);
                }} 
            />
        </Dialog>
    </>
);
