export default timestamp => {
    let date = 'Dec 12 2019 at 5:30pm'
    var weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];
    var now = new Date(timestamp);
    var month = months[now.getMonth()];
    var year = now.getFullYear();
    var monthDay = now.getDate();
    var week = weekDays[now.getDay()];
    var hour = now.getHours();
    var min = dec(now.getMinutes());
    var clock = " am";
    if (hour > 12) {
        clock = " pm";
        hour -= 12
    }
    function dec(num) {
        if (num < 10) return "0" + num;
        else return num;
    }
    var current = new Date()

    if (current.getDate() === monthDay) {
        date = "Today at " + hour + ":" + min + clock;
    } else if ((current.getDate() - monthDay === 1) || (current.getDate() - monthDay === -30)) {
        date = "Yesterday at " + hour + ":" + min + clock;
    } else if (
        current.getDate() - monthDay > 1 &&
        current.getDate() - monthDay < 7
    ) {
        date = week + " at " + hour + ":" + min + clock;
    } else if (year === current.getFullYear()) {
        date =
            month + " " + monthDay + " at " + monthDay + " " + hour + ":" + min + clock;
    } else if (year > current.getFullYear()) {
        date =
            month +
            " " +
            monthDay +
            " " +
            year +
            " at " +
            hour +
            ":" +
            min +
            clock;
    } else {
        date = week + '  ' + hour + ':' + min + clock
    }
    return date
}