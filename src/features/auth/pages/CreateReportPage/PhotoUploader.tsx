import { useRef, useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CloseIcon from '@mui/icons-material/Close';

interface PhotoUploaderProps {
    onFileChange: (file: File | null) => void;
}

export const PhotoUploader = ({ onFileChange }: PhotoUploaderProps) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleBoxClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
        onFileChange(file);
    };

    const handleRemoveImage = (event: React.MouseEvent) => {
        event.stopPropagation();
        setImagePreview(null);
        onFileChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <Box
            onClick={handleBoxClick}
            sx={{
                minHeight: { xs: '15rem', md: 'auto' },
                position: 'relative',
                border: imagePreview ? 'none' : '2px dashed',
                borderColor: 'surface.dark',
                borderRadius: '1rem',
                bgcolor: 'background.paper',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                overflow: 'hidden',
                transition: 'all 0.2s',
                '&:active': {
                    transform: 'scale(0.98)',
                    bgcolor: 'surface.main',
                },
            }}
        >
            <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />

            {imagePreview ? (
                <>
                    <Box
                        component="img"
                        src={imagePreview}
                        alt="Report preview"
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <IconButton
                        onClick={handleRemoveImage}
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                        }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                    <Typography
                        variant="caption"
                        sx={{
                            position: 'absolute',
                            bottom: 8,
                            bgcolor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            borderRadius: '1rem',
                            fontWeight: 600,
                            padding: '0.5rem',
                        }}
                    >
                        Tap to replace
                    </Typography>
                </>
            ) : (
                <>
                    <CameraAltIcon sx={{ color: 'primary.dark' }} fontSize="large" />
                    <Typography variant="body2" sx={{ color: 'text.disabled', fontWeight: 600 }}>
                        Tap to add a picture
                    </Typography>
                </>
            )}
        </Box>
    );
};
