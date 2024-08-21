import { Box } from "@mui/material";
import { FC } from "react";
import "src/index.css";

type LoadingProps = {
  isShow: boolean;
};

const Loading: FC<LoadingProps> = ({ isShow }) => {
  return (
    <>
      {isShow && (
        <Box sx={{ width: "100%" }} >
          <span  className="loader "></span>
        </Box>
      )}
    </>
  );
};

export default Loading;
