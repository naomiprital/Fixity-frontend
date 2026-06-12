import { Box, Typography, IconButton, CircularProgress, Chip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useMayorPulse } from '../api/mayorApi';
import './PublicPulse.css';

export const PublicPulse = () => {
  const { data: pulseData, isLoading } = useMayorPulse();

  const handleFavoriteClick = () => {
    alert('Public Pulse added to favorites!');
  };

  if (isLoading || !pulseData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8, width: '100%' }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  const {
    happinessScore,
    happinessDelta,
    trendingTopics,
    positiveCount,
    negativeCount,
    summary,
  } = pulseData;

  // Format numbers to short k notation (e.g. 1200 -> 1.2k)
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const isIncrease = happinessDelta.toLowerCase().includes('increase') || happinessDelta.startsWith('+');

  // Math for circular progress SVG
  const strokeWidth = 10;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (happinessScore / 100) * circumference;

  return (
    <Box className="public-pulse">
      {/* Header Row */}
      <Box className="pulse-header">
        <Box className="pulse-header__info">
          <Typography variant="h5" className="pulse-title">
            Public Pulse
          </Typography>
          <Typography variant="caption" className="pulse-subtitle">
            CITIZEN SENTIMENT
          </Typography>
        </Box>
        <IconButton className="pulse-fav-btn" onClick={handleFavoriteClick}>
          <FavoriteIcon />
        </IconButton>
      </Box>

      {/* Happiness Score Circular Card */}
      <Box className="happiness-card">
        <Typography variant="caption" className="happiness-card-title">
          HAPPINESS SCORE
        </Typography>

        <Box className="circular-progress-wrapper">
          <svg className="circular-progress-svg" width="140" height="140">
            {/* Background track ring */}
            <circle
              className="circle-bg"
              cx="70"
              cy="70"
              r={radius}
              strokeWidth={strokeWidth}
            />
            {/* Active filled ring with linear gradient */}
            <circle
              className="circle-fg"
              cx="70"
              cy="70"
              r={radius}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 70 70)"
            />
          </svg>

          {/* //TODO: change the css of the numbers to fit to the graph  */}
          {/* Centered Numbers */}
          <Box className="progress-center-text">
            <Typography variant="h3" className="score-value">
              {happinessScore}
            </Typography>
            <Typography variant="caption" className="score-denominator">
              /100
            </Typography>
          </Box>
        </Box>

        {/* Happiness Trend Indicator */}
        <Box className={`happiness-trend ${isIncrease ? 'trend--up' : 'trend--down'}`}>
          {isIncrease ? (
            <ArrowUpwardIcon sx={{ fontSize: '0.9375rem' }} />
          ) : (
            <ArrowDownwardIcon sx={{ fontSize: '0.9375rem' }} />
          )}
          <span>{happinessDelta}</span>
        </Box>
      </Box>

      {/* Trending Topics Tags Row */}
      <Box className="trending-topics">
        <Typography variant="caption" className="trending-title">
          TRENDING TOPICS
        </Typography>
        <Box className="topics-chips-list">
          {trendingTopics.map((topic) => {
            let colorClass = 'chip--neutral';
            if (topic.color === 'green') colorClass = 'chip--positive';
            if (topic.color === 'red') colorClass = 'chip--negative';
            if (topic.color === 'blue') colorClass = 'chip--info';

            return (
              <Chip
                key={topic.tag}
                label={topic.tag}
                className={`topic-chip ${colorClass}`}
              />
            );
          })}
        </Box>
      </Box>

      {/* AI Pulse Summary Card */}
      <Box className="ai-pulse-card">
        <Box className="ai-pulse-header">
          <SmartToyIcon sx={{ fontSize: '1.25rem' }} />
          <span>AI Pulse Summary</span>
        </Box>

        <Typography className="ai-pulse-text">
          "{summary}"
        </Typography>

        {/* Sentiment Statistics Counters */}
        <Box className="sentiment-counters-row">
          <Box className="counter-item">
            <Typography className="counter-val counter-val--positive">
              {formatNumber(positiveCount)}
            </Typography>
            <Typography className="counter-lbl">POSITIVE</Typography>
          </Box>
          <Box className="counter-item">
            <Typography className="counter-val counter-val--negative">
              {formatNumber(negativeCount)}
            </Typography>
            <Typography className="counter-lbl">NEGATIVE</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
