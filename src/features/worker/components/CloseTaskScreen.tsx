import React, { useRef, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  Paper,
  Chip,
  Container,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import { type Task, WORKER_COLORS } from '../types';
import { getImageUrl } from '@/utils/imageUtils';

interface CloseTaskScreenProps {
  task: Task;
  onBack: () => void;
  onResolve: (cityResponse: string, afterImageFile: File | null) => void;
}

export const CloseTaskScreen: React.FC<CloseTaskScreenProps> = ({ task, onBack, onResolve }) => {
  const [cityResponse, setCityResponse] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box sx={{ minHeight: '100%', backgroundColor: '#F8F9FA', pb: 4 }}>
      {/* Header */}
      <Box
        sx={{
          backgroundColor: WORKER_COLORS.tealHeader,
          color: 'white',
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <IconButton onClick={onBack} sx={{ color: 'white' }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
          Close Task
        </Typography>
        <Chip
          label="In Progress"
          size="small"
          sx={{
            backgroundColor: '#3498DB',
            color: 'white',
            fontWeight: 'bold',
            borderRadius: '8px',
          }}
        />
      </Box>

      <Container maxWidth="sm" sx={{ p: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1, mb: 3 }}>
          {task.incident.description}
        </Typography>

        {/* Original Report */}
        <Typography
          variant="caption"
          sx={{ fontWeight: 'bold', color: 'text.secondary', letterSpacing: '0.05em', mb: 1, display: 'block' }}
        >
          ORIGINAL REPORT
        </Typography>
        <Paper
          sx={{
            borderRadius: '16px',
            overflow: 'hidden',
            mb: 3,
            height: { xs: 200, md: 300 },
            backgroundColor: '#E0E0E0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {task.incident.reports?.[0]?.beforeImageUrl ? (
            <img
              src={getImageUrl(task.incident.reports[0].beforeImageUrl)}
              alt="Original incident"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              crossOrigin="anonymous"
            />
          ) : (
            <Typography variant="body2" color="text.secondary">
              No original incident image available
            </Typography>
          )}
        </Paper>

        {/* Proof of Work */}
        <Typography
          variant="caption"
          sx={{ fontWeight: 'bold', color: 'text.secondary', letterSpacing: '0.05em', mb: 1, display: 'block' }}
        >
          PROOF OF WORK (REQUIRED)
        </Typography>
        <Box
          onClick={handleBoxClick}
          sx={{
            border: `2px dashed ${WORKER_COLORS.tealHeader}`,
            borderRadius: '16px',
            height: { xs: 200, md: 300 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            mb: 3,
            backgroundColor: 'white',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <input
            type="file"
            hidden
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
          />
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <>
              <PhotoCameraIcon sx={{ fontSize: 40, color: WORKER_COLORS.tealHeader, mb: 1, opacity: 0.7 }} />
              <Typography variant="body2" sx={{ color: WORKER_COLORS.tealHeader, fontWeight: 'bold' }}>
                Tap to take "After" photo
              </Typography>
            </>
          )}
        </Box>

        {/* City Response */}
        <Typography
          variant="caption"
          sx={{ fontWeight: 'bold', color: 'text.secondary', letterSpacing: '0.05em', mb: 1, display: 'block' }}
        >
          CITY RESPONSE
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Write a note to the citizen... (e.g. Fixed with asphalt)"
          value={cityResponse}
          onChange={(e) => setCityResponse(e.target.value)}
          sx={{
            mb: 4,
            '& .MuiOutlinedInput-root': {
              borderRadius: '16px',
              backgroundColor: 'white',
            },
          }}
        />

        {/* Action Button */}
        <Button
          fullWidth
          variant="contained"
          disabled={!selectedFile}
          startIcon={<CheckCircleOutlineIcon />}
          onClick={() => onResolve(cityResponse, selectedFile)}
          sx={{
            backgroundColor: WORKER_COLORS.successGreen,
            color: 'white',
            borderRadius: '16px',
            py: 1.5,
            fontWeight: 'bold',
            fontSize: '1.1rem',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#27ae60',
            },
            '&.Mui-disabled': {
              backgroundColor: '#bdc3c7',
              color: 'white',
            },
          }}
        >
          Mark as Resolved
        </Button>
      </Container>
    </Box>
  );
};
