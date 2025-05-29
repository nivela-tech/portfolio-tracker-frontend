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
    handleAddEntry: (entry: any) => void;
    handleEditEntry?: (entry: any) => void; // Add handleEditEntry as a prop
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
    handleAddEntry, // Destructure handleAddEntry
    handleEditEntry // Destructure handleEditEntry
}) => (
    <>

        {/* Add Entry Dialog */}        <Dialog
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
                inDialog={true}
            />
        </Dialog>{/* Edit Entry Dialog */}        <Dialog
            open={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            maxWidth="sm"
            fullWidth
        >
            <AddEntryForm 
                entry={selectedEntry} 
                onSubmit={handleEditEntry}
                isEdit={true} 
                onSuccess={() => {
                    loadData();
                    setIsEditDialogOpen(false);
                    setSelectedEntry(null);
                }} 
                onCancel={() => {
                    setIsEditDialogOpen(false);
                    setSelectedEntry(null);
                }}
                inDialog={true}
            />
        </Dialog>
    </>
);
