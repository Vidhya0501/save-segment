import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBackIos";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const SCHEMA_OPTIONS = [
  { label: "First Name", value: "first_name", type: "user" },
  { label: "Last Name", value: "last_name", type: "user" },
  { label: "Gender", value: "gender", type: "user" },
  { label: "Age", value: "age", type: "user" },
  { label: "Account Name", value: "account_name", type: "group" },
  { label: "City", value: "city", type: "group" },
  { label: "State", value: "state", type: "group" },
];

export default function SegmentDrawer({ open, onClose }) {
  const [segmentName, setSegmentName] = useState("");
  const [schemas, setSchemas] = useState([""]);

  const handleAdd = () => setSchemas([...schemas, ""]);
  const handleRemove = (index) => setSchemas(schemas.filter((_, i) => i !== index));
  const handleChange = (index, val) => {
    const updated = [...schemas];
    updated[index] = val;
    setSchemas(updated);
  };

  const handleSave = async () => {
    const schemaList = schemas
      .filter(Boolean)
      .map((val) => {
        const opt = SCHEMA_OPTIONS.find((o) => o.value === val);
        return opt ? { [opt.value]: opt.label } : null;
      })
      .filter(Boolean);

    const payload = {
      segment_name: segmentName || "untitled_segment",
      schema: schemaList,
    };

    try {
      await axios.post("https://webhook.site/YOUR_WEBHOOK_ID", payload);
      alert("Segment saved!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error saving segment");
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: 400, borderTopLeftRadius: 2, borderBottomLeftRadius: 2 },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: "#4CB9B2",
          color: "white",
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6">Saving Segment</Typography>
      </Box>

      <Box p={3}>
        <Typography mb={1}>Enter the Name of the Segment</Typography>
        <TextField
          placeholder="Name of the segment"
          fullWidth
          size="small"
          value={segmentName}
          onChange={(e) => setSegmentName(e.target.value)}
        />

        <Typography mt={3} mb={1}>
          To save your segment, you need to add the schemas to build the query
        </Typography>

        <Box display="flex" justifyContent="flex-end" mb={1}>
            <Stack direction="row" spacing={2}>
                <Typography color="green" variant="body2">
                ● User Traits
                </Typography>
                <Typography color="red" variant="body2">
                ● Group Traits
                </Typography>
            </Stack>
        </Box>


        <Stack spacing={2}>
          {schemas.map((val, index) => {
            const selected = SCHEMA_OPTIONS.find((o) => o.value === val);
            return (
              <Box
                key={index}
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: 1,
                  p: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor:
                      selected?.type === "user"
                        ? "green"
                        : selected?.type === "group"
                        ? "red"
                        : "#ccc",
                  }}
                />
                <FormControl fullWidth size="small">
                  <InputLabel>Select schema</InputLabel>
                  <Select
                    value={val}
                    label="Select schema"
                    onChange={(e) => handleChange(index, e.target.value)}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {SCHEMA_OPTIONS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {schemas.length > 1 && (
                  <IconButton
                    color="error"
                    onClick={() => handleRemove(index)}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            );
          })}
        </Stack>

        <Box mt={1}>
          <Button
            onClick={handleAdd}
            startIcon={<AddIcon />}
            sx={{ color: "#4CB9B2", textTransform: "none" }}
          >
            + Add new schema
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Action Buttons */}
        <Box display="flex" justifyContent="space-between">
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#4CB9B2",
              "&:hover": { backgroundColor: "#3CA49D" },
            }}
            onClick={handleSave}
          >
            Save the Segment
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={onClose}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
