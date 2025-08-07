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
      try {
        // Get start and end dates of the week
        const startDate = weekDates[0];
        const endDate = weekDates[weekDates.length - 1];
        
        // Fetch data with week parameters
        const res = await fetch(`/api/tasks?start=${startDate}&end=${endDate}`);
        const tasks = await res.json();
        
        console.log("Fetched weekDates:", weekDates);
        console.log("Fetched tasks:", tasks);
        
        setData(tasks);
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(false);
      }
    };
    loadData();
  }, [day]); // Add weekDates as dependency

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
        footer: 'Total',
        Footer: () => {
          return <span style={{ fontSize: "0.775rem", color: "rgba(0, 0, 0, 0.87)", fontWeight: 700 }}>Total</span>;
        }
      },
      {
        accessorKey: "total",
        header: "Total",
        Cell: ({ row }) => {
          const timeline = row.original.timeline || {};
          const total = weekDates.reduce((sum, date) => {
            const val = Number(timeline[date]);
            return !isNaN(val) ? sum + val : sum;
          }, 0);
          return <span style={{ fontSize: "0.75rem", color: "#444" }}>{total} hrs</span>;
        },
        Footer: ({ table }) => {
          const allRows = table.getRowModel().rows;

          // Grand total for all projects (sum of all rows)
          const projectGrandTotal = allRows.reduce((sum, row) => {
            const timeline = row.original.timeline || {};
            const rowTotal = weekDates.reduce((subtotal, date) => {
              const val = Number(timeline[date]);
              return !isNaN(val) ? subtotal + val : subtotal;
            }, 0);
            return sum + rowTotal;
          }, 0);

          // Grand total for all days (sum for each day across all projects)
          const weekGrandTotal = weekDates.reduce((sum, date) => {
            const dayTotal = allRows.reduce((subtotal, row) => {
              const timeline = row.original.timeline || {};
              const val = Number(timeline[date]);
              return !isNaN(val) ? subtotal + val : subtotal;
            }, 0);
            return sum + dayTotal;
          }, 0);

          return (
            <div style={{ fontSize: "0.75rem", color: "#444", fontWeight: 500 }}>
              <span>Project: {projectGrandTotal} hrs</span>
              <br />
              <span>Week: {weekGrandTotal} hrs</span>
            </div>
          );
        },
        size: 90,
      },
      ...weekDates.map((date) => ({
        id: date,
        header: dayjs(date).format("ddd, MMM D"),
        accessorFn: (row) => row.timeline?.[date] || "",
        Cell: ({ cell }) => {
          const value = cell.getValue();
          return value !== undefined && value !== "" ? (
            <span style={{ fontSize: "0.75rem", color: "#444" }}>
              {value} hrs
            </span>
          ) : (
            <span style={{ color: "#999", fontSize: "0.75rem" }}>—</span>
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
          return <span style={{ fontSize: "0.75rem", color: "#444", fontWeight: 500 }}>{total} hrs</span>;
        },
        size: 85,
      })),
    ],
    [weekDates, setData]
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
          size: 50, // Reduced from 100 to 50
          grow: false,
          muiTableHeadCellProps: {
            align: 'center',
          },
          muiTableBodyCellProps: {
            align: 'center',
          },
        },
      }}
      renderRowActions={({ row, table }) => (
        <Box sx={{ display: "flex", gap: "0.25rem", overflow: "visible" }}>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => table.setEditingRow(row)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Week Entries">
            <IconButton
              size="small"
              color="error"
              onClick={async () => {
                try {
                  if (!window.confirm('Are you sure you want to delete this week\'s entries?')) {
                    return;
                  }

                  // Get the dates to be deleted
                  const datesToDelete = weekDates.filter(date => row.original.timeline?.[date]);

                  if (datesToDelete.length === 0) {
                    alert('No entries found for this week');
                    return;
                  }

                  const response = await fetch(`/api/tasks/${row.original.id}/week`, {
                    method: 'DELETE',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                      dates: datesToDelete,
                      start: weekDates[0],
                      end: weekDates[weekDates.length - 1]
                    })
                  });

                  if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to delete');
                  }

                  // Update UI by removing only the week's entries
                  setData(prevData => 
                    prevData.map(item => {
                      if (item.id === row.original.id) {
                        const newTimeline = { ...item.timeline };
                        weekDates.forEach(date => delete newTimeline[date]);
                        return {
                          ...item,
                          timeline: newTimeline
                        };
                      }
                      return item;
                    })
                  );

                } catch (error) {
                  console.error('Error deleting week entries:', error);
                  alert(`Failed to delete: ${error.message}`);
                }
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )}
      onCreatingRowSave={async ({ row, values, table }) => {
        try {
          const { project, ...rest } = values;

          if (!project) {
            alert("Project is required.");
            return;
          }

          // Use project name (lowercase) as ID
          const newId = project.toLowerCase();

          // Check if project already exists in current week
          const projectExists = data.some(item => 
            item.project.toLowerCase() === project.toLowerCase()
          );

          if (projectExists) {
            alert("Project already exists for this week.");
            return;
          }

          // Build timeline object
          const timeline = {};
          Object.entries(rest).forEach(([date, value]) => {
            if (value && !isNaN(value) && value !== "") {
              timeline[date] = Number(value);
            }
          });

          const newRow = {
            id: newId,
            project,
            timeline,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          console.log("Sending new row:", newRow);

          const response = await fetch("/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newRow)
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to save");
          }

          const savedRow = await response.json();
          setData(prevData => [...prevData, savedRow]);
          table.setCreatingRow(null);

        } catch (error) {
          console.error("Error creating row:", error);
          alert(`Failed to create row: ${error.message}`);
        }
      }}
      onEditingRowSave={async ({ row, values, table }) => {
        try {
          const { project, ...rest } = values;

          if (!project) {
            alert("Project is required.");
            return;
          }

          // Build timeline object with only valid numeric values
          const timeline = {};
          Object.entries(rest).forEach(([date, value]) => {
            if (value && !isNaN(value) && value !== "") {
              timeline[date] = Number(value);
            }
          });

          const updatedRow = {
            id: row.original.id,
            project: project,
            timeline: timeline
          };

          console.log("Sending updated row:", updatedRow);

          const response = await fetch(`/api/tasks/${row.original.id}`, {
            method: "PUT",
            headers: { 
              "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedRow)
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update");
          }

          const savedRow = await response.json();
          console.log("Received updated row:", savedRow);

          // Update table data immediately
          setData(prevData => 
            prevData.map(item => 
              item.id === savedRow.id ? savedRow : item
            )
          );
          
          table.setEditingRow(null);

        } catch (error) {
          console.error("Error updating row:", error);
          alert(`Failed to update row: ${error.message}`);
        }
      }}
      renderTopToolbarCustomActions={({ table }) => (
        <Button
          size="small"
          color="primary"
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
          Add Project
        </Button>
      )}
    />
  );
};

export default MaterialTable;
