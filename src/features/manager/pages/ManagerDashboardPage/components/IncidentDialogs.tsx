import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, darken,
} from '@mui/material';
import type { Incident } from '@/types/models';

interface CreateIncidentDialogProps {
  open: boolean;
  selectedCount: number;
  description: string;
  onDescriptionChange: (v: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}

interface EditIncidentDialogProps {
  incident: Incident | null;
  description: string;
  onDescriptionChange: (v: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}

interface DeleteIncidentDialogProps {
  incidentId: number | null;
  onConfirm: () => void;
  onClose: () => void;
}

export function CreateIncidentDialog({
  open, selectedCount, description, onDescriptionChange, onConfirm, onClose,
}: CreateIncidentDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontFamily: '"Sora", sans-serif', fontWeight: 700 }}>Create Incident</DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 2, color: 'text.secondary' }}>
          Creating incident from <strong>{selectedCount}</strong> selected report(s).
        </Typography>
        <TextField
          autoFocus label="Description" fullWidth multiline rows={3}
          value={description}
          onChange={e => onDescriptionChange(e.target.value)}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '0.5rem' } }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={onClose} sx={{ borderRadius: '0.75rem' }}>Cancel</Button>
        <Button
          variant="contained" onClick={onConfirm}
          sx={{ bgcolor: 'primary.main', borderRadius: '0.75rem', fontWeight: 700, '&:hover': { bgcolor: (t) => darken(t.palette.primary.main, 0.2) } }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function EditIncidentDialog({ incident, description, onDescriptionChange, onConfirm, onClose }: EditIncidentDialogProps) {
  return (
    <Dialog open={!!incident} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontFamily: '"Sora", sans-serif', fontWeight: 700 }}>Edit Incident</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus label="Description" fullWidth multiline rows={3}
          value={description}
          onChange={e => onDescriptionChange(e.target.value)}
          sx={{ mt: 1, '& .MuiOutlinedInput-root': { borderRadius: '0.5rem' } }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={onClose} sx={{ borderRadius: '0.75rem' }}>Cancel</Button>
        <Button
          variant="contained" onClick={onConfirm}
          sx={{ bgcolor: 'primary.main', borderRadius: '0.75rem', fontWeight: 700, '&:hover': { bgcolor: (t) => darken(t.palette.primary.main, 0.2) } }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function DeleteIncidentDialog({ incidentId, onConfirm, onClose }: DeleteIncidentDialogProps) {
  return (
    <Dialog open={!!incidentId} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontFamily: '"Sora", sans-serif', fontWeight: 700 }}>Delete Incident?</DialogTitle>
      <DialogContent>
        <Typography sx={{ color: 'text.secondary' }}>
          This will delete all linked tasks and unlink all reports. This cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={onClose} sx={{ borderRadius: '0.75rem' }}>Cancel</Button>
        <Button variant="contained" color="error" onClick={onConfirm} sx={{ borderRadius: '0.75rem', fontWeight: 700 }}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}