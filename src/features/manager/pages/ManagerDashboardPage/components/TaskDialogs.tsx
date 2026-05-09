import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Typography, FormControl, InputLabel, Select, MenuItem, darken,
} from '@mui/material';
import type { Task, TaskCategory } from '@/types/models';

interface EditTaskDialogProps {
  task: Task | null;
  taskCategories: TaskCategory[];
  notes: string;
  categoryId: number;
  onNotesChange: (v: string) => void;
  onCategoryChange: (v: number) => void;
  onConfirm: () => void;
  onClose: () => void;
}

interface DeleteTaskDialogProps {
  taskId: number | null;
  onConfirm: () => void;
  onClose: () => void;
}

export function EditTaskDialog({
  task, taskCategories, notes, categoryId,
  onNotesChange, onCategoryChange, onConfirm, onClose,
}: EditTaskDialogProps) {
  return (
    <Dialog open={!!task} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontFamily: '"Sora", sans-serif', fontWeight: 700 }}>Edit Task</DialogTitle>
      <DialogContent>
        <FormControl fullWidth size="small" sx={{ mt: 1, mb: 2 }}>
          <InputLabel>Category</InputLabel>
          <Select
            label="Category"
            value={categoryId || ''}
            onChange={e => onCategoryChange(Number(e.target.value))}
            sx={{ borderRadius: '0.5rem' }}
          >
            {taskCategories.map(cat => (
              <MenuItem key={cat.categoryId} value={cat.categoryId}>{cat.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Worker Notes" fullWidth multiline rows={3}
          value={notes}
          onChange={e => onNotesChange(e.target.value)}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '0.5rem' } }}
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

export function DeleteTaskDialog({ taskId, onConfirm, onClose }: DeleteTaskDialogProps) {
  return (
    <Dialog open={!!taskId} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontFamily: '"Sora", sans-serif', fontWeight: 700 }}>Delete Task?</DialogTitle>
      <DialogContent>
        <Typography sx={{ color: 'text.secondary' }}>This action cannot be undone.</Typography>
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