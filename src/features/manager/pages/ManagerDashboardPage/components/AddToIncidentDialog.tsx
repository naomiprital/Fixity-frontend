import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText, ListItemButton } from '@mui/material';
import type { Incident } from '@/types/models';

interface Props {
  open: boolean;
  onClose: () => void;
  incidents: Incident[];
  onAdd: (incidentId: number) => void;
}

export function AddToIncidentDialog({ open, onClose, incidents, onAdd }: Props) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700 }}>Add to Existing Incident</DialogTitle>
      <DialogContent dividers>
        <List sx={{ pt: 0 }}>
          {incidents.length === 0 ? (
            <ListItem>
              <ListItemText primary="No active incidents found." />
            </ListItem>
          ) : (
            incidents.map((inc) => (
              <ListItem disablePadding key={inc.incidentId}>
                <ListItemButton onClick={() => onAdd(inc.incidentId)}>
                  <ListItemText 
                    primary={inc.description || `Incident #${inc.incidentId}`} 
                    secondary={`${inc.reports.length} reports · ${inc.tasks.length} tasks`}
                  />
                </ListItemButton>
              </ListItem>
            ))
          )}
        </List>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} sx={{ fontWeight: 700 }}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
