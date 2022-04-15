import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const Loading = (props) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", marginTop: "6vh" }}>
      <CircularProgress />
    </Box>
  );
};
export default Loading;
