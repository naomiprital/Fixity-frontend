import { CircularProgress } from "@mui/material";

interface LoaderProps {
    size?: string;
}
const Loader = ({ size = "2rem" }: LoaderProps) => {
    return (
        <CircularProgress
            color="inherit"
            size={size}
        />
    );
};

export default Loader;