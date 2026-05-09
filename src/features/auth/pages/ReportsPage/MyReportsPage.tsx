import { useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useMyReports } from '../../../../hooks/Reports';
import './MyReportsPage.css';
import { ReportCard } from '../../components/ReportCard';

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
                        <AssignmentIcon sx={{ fontSize: 48, opacity: 0.5, mb: 2 }} />
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
                        <ReportCard key={report.reportId} report={report} isOwner={true} />
                    ))
                )}
            </Box>
        </Box>
    );
};

export default MyReportsPage;
