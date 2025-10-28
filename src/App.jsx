import React, { useState } from "react";
import { Box, Button, Container, Typography, Backdrop } from "@mui/material";
import SegmentDrawer from "./components/SegmentDrawer";

export default function App() {
  const [open, setOpen] = useState(false);

  const handleCloseDrawer = () => setOpen(false);

  return (
    <>
      <Backdrop
        sx={{
          zIndex: (theme) => theme.zIndex.drawer - 1,
          backdropFilter: open ? "blur(4px)" : "none",
          backgroundColor: open ? "rgba(0, 0, 0, 0.3)" : "transparent",
          transition: "all 0.3s ease",
        }}
        open={open}
        onClick={handleCloseDrawer}
      />

      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f9f9f9",
          filter: open ? "blur(4px)" : "none",
          transition: "filter 0.3s ease",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#4CB9B2",
            color: "white",
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Typography variant="h6" sx={{ ml: 1 }}>
            View Audience
          </Typography>
        </Box>

        <Container
          maxWidth="sm"
          sx={{
            textAlign: "center",
            mt: 10,
          }}
        >
          <Button
            variant="outlined"
            sx={{
              color: "#4CB9B2",
              borderColor: "#4CB9B2",
              px: 4,
              py: 1.5,
              fontWeight: 500,
              "&:hover": {
                backgroundColor: "#4CB9B2",
                color: "white",
              },
            }}
            onClick={() => setOpen(true)}
          >
            Save segment
          </Button>

          <Typography color="text.secondary" sx={{ mt: 3 }}>
            Click “Save segment” to open the side panel and build your segment.
          </Typography>
        </Container>
      </Box>

      <SegmentDrawer open={open} onClose={handleCloseDrawer} />
    </>
  );
}
