export const listMonth = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const getDaysInMonth = (month, year) => {
    var date = new Date(year, month, 1);
    var days = [];
    while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    //console.log(days);
    return days;
}

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
}

export const projects = [
    {
        key: 'hgsi',
        name: 'HGSI'
    },
    {
        key: 'wri',
        name: 'WRI'
    },
    {
        key: 'koeing',
        name: 'Koeing'
    },
    {
        key: 'mdrc',
        name: 'MDRC'
    },
    {
        key: 'inx',
        name: 'INX'
    },
]