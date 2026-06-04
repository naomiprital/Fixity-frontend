import React, { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

interface ExpandableTextWithDialogProps {
  text: string;
  limit?: number;
  variant?: string;
  sx?: any;
}

export function ExpandableTextWithDialog({ text, limit = 150, variant = 'body2', sx = {} }: ExpandableTextWithDialogProps) {
  const [open, setOpen] = useState(false);
  const truncated = text.length > limit ? `${text.substring(0, limit)}...` : text;

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  return (
    <>
      <Typography variant={variant as any} sx={sx}>
        {truncated}{' '}
        {text.length > limit && (
          <Box
            component="span"
            onClick={handleOpen}
            sx={{
              color: 'primary.main',
              fontWeight: 700,
              cursor: 'pointer',
              ml: 0.5,
              fontSize: '0.75em',
              textTransform: 'uppercase',
            }}
          >
            Read More
          </Box>
        )}
      </Typography>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Report Description</DialogTitle>
        <DialogContent dividers>
          <Typography variant={variant as any}>{text}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
