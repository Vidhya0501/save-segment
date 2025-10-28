import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Stack,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Remove";
import ArrowBackIcon from "@mui/icons-material/ArrowBackIosNew";

const SegmentDrawer = ({ open, onClose }) => {
  const [segmentName, setSegmentName] = useState("");
  const [schemas, setSchemas] = useState([{ value: "" }]);

const schemaOptions = [
  { value: "first_name", label: "First Name", type: "user" },
  { value: "last_name", label: "Last Name", type: "user" },
  { value: "gender", label: "Gender", type: "user" },
  { value: "age", label: "Age", type: "user" },
  { value: "account_name", label: "Account Name", type: "group" },
  { value: "city", label: "City", type: "group" },
  { value: "state", label: "State", type: "group" },
];
  
const webhookUrl = import.meta.env.VITE_WEBHOOK_URL;

  const handleAddSchema = () => {
    setSchemas([...schemas, { value: "" }]);
  };

  const handleRemoveSchema = (index) => {
    const updatedSchemas = schemas.filter((_, i) => i !== index);
    setSchemas(updatedSchemas);
  };

  const handleSchemaChange = (index, value) => {
    if (schemas.some((schema, i) => schema.value === value && i !== index)) {
      alert("This schema is already selected!");
      return;
    }

    const updatedSchemas = schemas.map((schema, i) =>
      i === index ? { ...schema, value } : schema
    );
    setSchemas(updatedSchemas);
  };

  const handleSave = async () => {
    if (!segmentName.trim()) {
      alert("Please enter the segment name");
      return;
    }

    const selectedSchemas = schemas
      .map((s) => s.value)
      .filter((v) => v.trim() !== "");

    if (selectedSchemas.length === 0) {
      alert("Please select at least one schema");
      return;
    }

    const payload = {
        segment_name: segmentName,
        schema: selectedSchemas.map((s) => {
          const option = schemaOptions.find((opt) => opt.value === s);
          return { [option.value]: option.label };
        }),
      };
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        mode: "no-cors",
      });

      alert("Segment saved successfully!");
      handleReset();
      onClose();
    } catch (error) {
      console.error("Error saving segment:", error);
      alert("Something went wrong while saving the segment.");
    }
  };

  const handleReset = () => {
    setSegmentName("");
    setSchemas([{ value: "" }]);
  };

  const handleCancel = () => {
    handleReset();
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={handleCancel}>
      <Box
      sx={{
        width: 400,
        height: "100vh", 
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
    <Box
        sx={{
          backgroundColor: "#36A7A3",
          color: "white",
          display: "flex",
          alignItems: "center",
          p: 2,
          mb: 2,
        }}
      >
        <IconButton
          onClick={handleCancel}
          sx={{ color: "white", mr: 1 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6">Saving Segment</Typography>
      </Box>
      <Box sx={{
              flex: 1,
              overflowY: "auto",
              p: 3,
            }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Enter the Name of the Segment
        </Typography>
        <TextField
          fullWidth
          placeholder="Name of the segment"
          value={segmentName}
          onChange={(e) => setSegmentName(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Typography variant="body2" sx={{ mb: 2 }}>
          To save your segment, you need to add the schemas to build the query
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="flex-end" mb={1}>
          <Typography color="green" variant="body2">
            ● User Traits
          </Typography>
          <Typography color="red" variant="body2">
            ● Group Traits
          </Typography>
        </Stack>

        {schemas.map((schema, index) => {
          const selectedType = schemaOptions.find(
            (s) => s.label === schema.value
          )?.type;

          const selectedValues = schemas.map((s) => s.value);

          return (
            <Stack
              key={index}
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{
                border: "1px solid #ddd",
                borderRadius: 1,
                p: 1,
                mb: 2,
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor:
                    selectedType === "user"
                      ? "green"
                      : selectedType === "group"
                      ? "red"
                      : "gray",
                }}
              />
              <TextField
                select
                fullWidth
                value={schema.value}
                onChange={(e) => handleSchemaChange(index, e.target.value)}
                displayEmpty
                sx={{
                  "& .MuiSelect-displayEmpty": {
                    color: "#9e9e9e", 
                  },
                }}
              >
                 <MenuItem value="" disabled>Add schema to segment</MenuItem>
                {schemaOptions.map((option, idx) => (
                  <MenuItem
                    key={idx}
                    value={option.value}
                    disabled={
                      selectedValues.includes(option.value) && option.value !== schema.value
                    }
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <IconButton onClick={() => handleRemoveSchema(index)}>
                <DeleteIcon sx={{ color: "#9e9e9e" }} />
              </IconButton>
            </Stack>
          );
        })}

        <Button
          startIcon={<AddIcon />}
          onClick={handleAddSchema}
          sx={{ color: "#4CB9B2", mb: 3 }}
        >
          Add new schema
        </Button>
        </Box>
        <Box
      sx={{
        borderTop: "1px solid #ddd",
        p: 2,
        display: "flex",
        justifyContent: "flex-start",
        gap: 2,
        backgroundColor: "#fff",
      }}
    >
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#4CB9B2",
          "&:hover": { backgroundColor: "#3aa59c" },
        }}
        onClick={handleSave}
      >
        Save the Segment
      </Button>

      <Button variant="outlined" color="error" onClick={handleCancel}>
        Cancel
      </Button>
    </Box>
    </Box>
    </Drawer>
  );
};

export default SegmentDrawer;
