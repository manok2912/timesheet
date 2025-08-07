import dayjs from "dayjs";

export const listMonth = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const projects = [
  "JNJ",
  "WRI",
  "SSCAL",
  "NHF",
  "UNCP",
  "BSC",
  "ADMIN",
]


export const openDeleteConfirmModal = (row) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      //deleteUser(row.original.id);
    }
}

export const normalizeToPercent = (values) => {
  const total = values.reduce((sum, val) => sum + val, 0);
  return total === 0 ? values.map(() => 0) : values.map((val) => (val / total) * 100);
}

export const getWeekOptions = (currentDay) => {
  // Returns an array of week start dates (Monday) for the whole year
  const yearStart = dayjs(currentDay).startOf('year').startOf('week');
  const yearEnd = dayjs(currentDay).endOf('year').endOf('week');
  const weeks = [];
  let weekStart = yearStart;

  while (weekStart.isBefore(yearEnd)) {
    weeks.push(weekStart);
    weekStart = weekStart.add(7, 'day');
  }
  return weeks;
}

export const getWeekNumber = (dateString) => {
  const date = dateString ? dayjs(dateString) : dayjs();

  const startOfYear = dayjs(`${date.year()}-01-01`);
  const dayOfYear = date.diff(startOfYear, "day") + 1;

  const jan1Weekday = startOfYear.day(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const weekOffset = jan1Weekday <= 4 ? jan1Weekday - 1 : jan1Weekday - 8;

  const weekNumber = Math.floor((dayOfYear - weekOffset + 6) / 7);
  return weekNumber;
};

export const getWeekRangeFromDate = (dateString) => {
  const date = dayjs(dateString);
  const start = date.startOf("week").add(1, "day");
  const end = start.add(6, "day");
  const weekNumber = getWeekNumber(dateString);

  return {
    start: start.format("YYYY-MM-DD"),
    end: end.format("YYYY-MM-DD"),
    label: `Week ${weekNumber}: ${start.format("MMM D")} - ${end.format(
      "D, YYYY"
    )}`,
  };
};

export const getDatesInCurrentWeek = (dateString) => {
  const date = dateString ? dayjs(dateString) : dayjs();

  // Start on Monday
  const startOfWeek = date.startOf("week").add(1, "day");

  // Return an array of all 7 dates (Mon to Sun)
  return Array.from({ length: 7 }).map((_, i) =>
    startOfWeek.add(i, "day").format("YYYY-MM-DD")
  );
};

/////////////////////////////////////////////
export const getDaysInMonth = (month, year) => {
  var date = new Date(year, month, 1);
  var days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  //console.log(days);
  return days;
};

export const getMonths = (month, year) => {
  var fromDate = new Date(year, month - 6, 1);
  var toDate = new Date(year, month + 6, 1);
  const fromYear = fromDate.getFullYear();
  const fromMonth = fromDate.getMonth();
  const toYear = toDate.getFullYear();
  const toMonth = toDate.getMonth();
  const months = [];
  for (let year = fromYear; year <= toYear; year++) {
    let monthNum = year === fromYear ? fromMonth : 0;
    const monthLimit = year === toYear ? toMonth : 11;
    for (; monthNum <= monthLimit; monthNum++) {
      let month = monthNum + 1;
      months.push(new Date(year, month, 1));
    }
  }
  return months;
};
