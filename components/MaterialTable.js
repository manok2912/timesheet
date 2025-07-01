import { useEffect, useState, useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table"; // ✅ Correct
import { getDatesInCurrentWeek } from "../helpers/helper";
import dayjs from "dayjs";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import { openDeleteConfirmModal, projects } from "../helpers/helper"; // ✅ Ensure this function is
import Button from "@mui/material/Button";

const MaterialTable = ({ day }) => {
  const weekDates = getDatesInCurrentWeek(day.toISOString());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const res = await fetch("/api/tasks");
      const tasks = await res.json();
      console.log("Fetched weekDates:", weekDates);
      console.log("Fetched tasks:", tasks);
      setData(tasks);
      setLoading(false);
    };
    loadData();
  }, []);

  // ✅ Memoized: Sample data
  const TDdata = useMemo(
    () => [
      {
        project: "Website Redesign",
        tasks: {
          [weekDates[0]]: "Wireframe",
          [weekDates[1]]: "UI Design",
        },
      },
      {
        project: "Mobile App",
        tasks: {
          [weekDates[2]]: "Login API",
          [weekDates[4]]: "Testing",
        },
      },
    ],
    [weekDates]
  );

  // ✅ Memoized: Columns with dynamic dates
  const columns = useMemo(
    () => [
      {
        accessorKey: "project",
        header: "Project",
        editVariant: "select",
        editSelectOptions: projects,

        size: 70,
      },
      ...weekDates.map((date) => ({
        id: date,
        header: dayjs(date).format("ddd, MMM D"),
        accessorFn: (row) => row.timeline?.[date] || "",
        Cell: ({ cell }) => {
          const value = cell.getValue();
          return value !== undefined && value !== "" ? (
            `${value} hrs`
          ) : (
            <span style={{ color: "#999" }}>—</span>
          );
        },
        muiEditTextFieldProps: {
          type: "number",
          inputProps: {
            min: 0,
            max: 24,
          },
          placeholder: "hrs",
        },
        Footer: () => {
          const total = data.reduce((sum, row) => {
            const value = row.timeline?.[date];
            return sum + (value ? Number(value) : 0);
          }, 0);
          return <span>Total: {total} hrs</span>;
        },
        size: 90,
      })),
      {
        accessorKey: "total",
        header: "Total",
        Cell: ({ row }) => {
          const timeline = row.original.timeline || {};
          const total = weekDates.reduce((sum, date) => {
            const val = Number(timeline[date]);
            return !isNaN(val) ? sum + val : sum;
          }, 0);
          return <span>{total} hrs</span>;
        },
        Footer: ({ table }) => {
          const allRows = table.getRowModel().rows;

          const grandTotal = allRows.reduce((sum, row) => {
            const timeline = row.original.timeline || {};
            const rowTotal = weekDates.reduce((subtotal, date) => {
              const val = Number(timeline[date]);
              return !isNaN(val) ? subtotal + val : subtotal;
            }, 0);
            return sum + rowTotal;
          }, 0);

          return <strong>Total: {grandTotal} hrs</strong>;
        },
        size: 80,
      },
    ],
    [weekDates]
  );
  console.log("Data:", data);

  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      enableStickyHeader
      enableColumnResizing
      enableFullScreenToggle={true}
      enableColumnFilters={false}
      enableSorting={false}
      enablePagination={false}
      enableColumnActions={false}
      enableEditing={true}
      createDisplayMode="row" // ('modal', and 'custom' are also available)
      editDisplayMode="row" // ('modal', 'cell', 'table', and 'custom' are also available)
      getRowId={(row) => row.id}
      displayColumnDefOptions={{
        "mrt-row-actions": {
          size: 100, // Try 120, 140, etc. if needed
          grow: false,
        },
      }}
      renderRowActions={({ row, table }) => (
        <Box sx={{ display: "flex", gap: "0.5rem", overflow: "visible" }}>
          <Tooltip title="Edit">
            <IconButton onClick={() => table.setEditingRow(row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              color="error"
              onClick={() => openDeleteConfirmModal(row)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}
      onCreatingRowSave={async ({ row, values, table }) => {
        console.log("Creating row:", row, values, table);
        try {
          const { project, ...rest } = values;

          if (!project) {
            alert("Project is required.");
            return;
          }

          // Build the timeline object by filtering only numeric entries
          const timeline = Object.entries(rest).reduce((acc, [date, value]) => {
            if (value && !isNaN(value)) {
              acc[date] = Number(value);
            }
            return acc;
          }, {});

          // Construct the final row
          const newRow = {
            id: project.toLowerCase(),
            project,
            timeline,
          };

          console.log("New row to save:", newRow);

          // Optional: Save to backend
          // await fetch('/api/project', { ... })
          // ✅ Send to backend
          const response = await fetch("/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newRow),
          });

          if (!response.ok) throw new Error("Failed to save");

          // Optional: get the saved row from response
          const savedRow = await response.json();
          console.log("Saved row:", savedRow);

          // Add to table
          setData(savedRow);
          table.setCreatingRow(null); //exit creating mode
        } catch (error) {
          console.error("Error saving row:", error);
          alert("Failed to save row.");
        }
        // Handle row creation logic here
      }}
      onEditingRowSave={async ({ row, values, table }) => {
        // Handle row editing logic here
        console.log("Editing row:", row, values);

        try {
          const { project, ...rest } = values;

          if (!project) {
            alert("Project is required.");
            return;
          }

          // Build the updated timeline
          const timeline = Object.entries(rest).reduce((acc, [date, value]) => {
            if (value && !isNaN(value)) {
              acc[date] = Number(value);
            }
            return acc;
          }, {});

          const updatedRow = {
            id: project.toLowerCase(),
            project,
            timeline,
          };

          // ✅ Send to backend
          const response = await fetch("/api/tasks", {
            method: "POST", // or PUT if your API expects it
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedRow),
          });

          if (!response.ok) throw new Error("Failed to update");

          const savedRow = await response.json();
          console.log("Saved row:", savedRow);

          // Find and update the row by index
          setData(savedRow);

          table.setEditingRow(null); //exit editing mode
        } catch (error) {
          console.error("Error editing row:", error);
          alert("Failed to edit row.");
        }
      }}
      renderTopToolbarCustomActions={({ table }) => (
        <Button
          variant="contained"
          onClick={() => {
            table.setCreatingRow(true); //simplest way to open the create row modal with no default values
            //or you can pass in a row object to set default values with the `createRow` helper function
            // table.setCreatingRow(
            //   createRow(table, {
            //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
            //   }),
            // );
          }}
        >
          Create New User
        </Button>
      )}
    />
  );
};

export default MaterialTable;
