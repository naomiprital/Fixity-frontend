import React, { type ReactNode } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import './StatCard.css';

interface StatCardProps {
  title: string;
  accentColor?: 'red' | 'green' | 'orange' | 'teal';
  accentPosition?: 'bottom' | 'left';
  children: ReactNode;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  accentColor = 'teal',
  accentPosition = 'bottom',
  children,
  className = '',
}) => {
  const accentClass = `stat-card--accent-${accentColor}`;
  const positionClass = `stat-card--position-${accentPosition}`;

  return (
    <Card className={`stat-card ${accentClass} ${positionClass} ${className}`}>
      <CardContent className="stat-card__content">
        <Typography variant="caption" className="stat-card__title">
          {title}
        </Typography>
        <Box className="stat-card__body">
          {children}
        </Box>
      </CardContent>
    </Card>
  );
};
