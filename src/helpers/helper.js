export const listMonth = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const getDaysInMonth = (month, year) => {
    var date = new Date(year, month, 1);
    var days = [];
    while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    console.log(days);
    return days;
}