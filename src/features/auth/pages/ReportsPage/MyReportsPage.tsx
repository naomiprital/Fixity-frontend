import { useState } from 'react';
import { Box, Typography, IconButton, CircularProgress } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import { useMyReports } from '../../../../hooks/Reports';
import { format } from 'date-fns';
import './MyReportsPage.css';

const MyReportsPage = () => {
    const { data: reports, isLoading, isError } = useMyReports();
    const [activeTab, setActiveTab] = useState<'ongoing' | 'completed'>('ongoing');

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress color="primary" />
            </Box>
        );
    }

    if (isError) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="error">Failed to load your reports. Please try again later.</Typography>
            </Box>
        );
    }

    const ongoingReports = reports?.filter(r => r.status === 'Open' || r.status === 'InProgress') || [];
    const completedReports = reports?.filter(r => r.status === 'Closed') || [];

    const displayedReports = activeTab === 'ongoing' ? ongoingReports : completedReports;

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'Open': return 'status-open';
            case 'InProgress': return 'status-inprogress';
            case 'Closed': return 'status-closed';
            default: return '';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'Open': return 'Received';
            case 'InProgress': return 'In Progress';
            case 'Closed': return 'Completed';
            default: return status;
        }
    };

    const getProgressWidth = (status: string) => {
        switch (status) {
            case 'Open': return '15%';
            case 'InProgress': return '60%';
            case 'Closed': return '100%';
            default: return '0%';
        }
    };

    const API_BASE = import.meta.env.VITE_SERVER_BASE_URL || 'http://localhost:3000/api';
    const IMAGE_BASE = API_BASE.replace('/api', '');

    return (
        <Box className="my-reports-page">
            <Box className="my-reports-header">
                <Box className="my-reports-header-top">
                    <Typography variant="h1">My Reports</Typography>
                </Box>
                <Box className="tabs-container">
                    <button 
                        className={`tab-button ${activeTab === 'ongoing' ? 'active' : ''}`}
                        onClick={() => setActiveTab('ongoing')}
                    >
                        Open Reports
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`}
                        onClick={() => setActiveTab('completed')}
                    >
                        Past Reports
                    </button>
                </Box>
            </Box>

            <Box className="reports-content">
                {displayedReports.length === 0 ? (
                    <Box className="empty-state">
                        {activeTab === 'ongoing' ? <AssignmentIcon /> : <CheckCircleOutlineIcon />}
                        <Typography variant="h6">
                            {activeTab === 'ongoing' ? "No open reports" : "No completed reports"}
                        </Typography>
                        <Typography variant="body2">
                            {activeTab === 'ongoing' 
                                ? "You haven't submitted any reports yet or all your reports are completed." 
                                : "You don't have any past reports yet."}
                        </Typography>
                    </Box>
                ) : (
                    displayedReports.map((report) => (
                        <Box key={report.reportId} className="report-card">
                            <img 
                                src={report.beforeImageUrl ? `${IMAGE_BASE}${report.beforeImageUrl}` : 'https://placehold.co/80'} 
                                alt={report.description} 
                                className="report-image"
                                crossOrigin="anonymous"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    if (target.src !== 'https://placehold.co/80') {
                                        target.src = 'https://placehold.co/80';
                                    }
                                }}
                            />
                            <Box className="report-details">
                                <Box className="report-title-row">
                                    <Typography className="report-title">{report.category?.name || 'General'}</Typography>
                                    {report.status === 'Open' && (
                                        <IconButton size="small" className="delete-btn">
                                            <DeleteOutlineIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                </Box>
                                <Box>
                                    <span className={`status-chip ${getStatusClass(report.status)}`}>
                                        {getStatusLabel(report.status)}
                                    </span>
                                </Box>
                                
                                {report.status === 'InProgress' && (
                                    <Box className="progress-bar-container">
                                        <Box 
                                            className="progress-bar" 
                                            style={{ width: getProgressWidth(report.status) }}
                                        />
                                    </Box>
                                )}

                                <Box className="report-footer">
                                    <Typography className="report-meta">
                                        {report.status === 'Open' 
                                            ? `Opened: ${format(new Date(report.createdAt), 'MMM d, HH:mm')}`
                                            : report.status === 'InProgress' 
                                                ? 'City worker is handling this' 
                                                : `Closed: ${format(new Date(report.createdAt), 'MMM d, HH:mm')}`}
                                    </Typography>
                                    <Typography className="report-id">#TR-{report.reportId}</Typography>
                                </Box>
                            </Box>
                        </Box>
                    ))
                )}
            </Box>
        </Box>
    );
};

export default MyReportsPage;
