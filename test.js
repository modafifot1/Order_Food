var bookings = [
  {
    id: 1,
    startDate: "2021-08-02",
    endDate: "2021-08-04",
    project: {
      id: 1,
      name: "Globis Sight",
      clientName: "CLIENT MANAGED",
      textColor: "#fff",
      color: "#fb7e3c",
      colorPattern: "#c86430",
    },
  },
  {
    id: 2,
    startDate: "2021-08-02",
    endDate: "2021-08-05",
    project: {
      id: 1,
      name: "Globis Sight",
      clientName: "CLIENT MANAGED",
      textColor: "#fff",
      color: "#fb7e3c",
      colorPattern: "#c86430",
    },
  },
  {
    id: 3,
    startDate: "2021-08-05",
    endDate: "2021-08-05",
    project: {
      id: 1,
      name: "Globis Sight",
      clientName: "CLIENT MANAGED",
      textColor: "#fff",
      color: "#89d34f",
      colorPattern: "#6da83f",
    },
  },
  {
    id: 3,
    startDate: "2021-09-05",
    endDate: "2021-10-05",
    project: {
      id: 1,
      name: "Globis Sight",
      clientName: "CLIENT MANAGED",
      textColor: "#fff",
      color: "#89d34f",
      colorPattern: "#6da83f",
    },
  },
];
var compareDate = (date1, date2) => {
  console.log("date1: " + date1);
  console.log("date2: " + date2);
  let lDate = new Date(date1);
  let rDate = new Date(date2);
  return lDate.getTime() > rDate.getTime();
};
console.log(compareDate("2021-08-02", "2021-08-02"));
bookings = bookings.reduce((init, cur) => {
  console.log("cur: " + cur);
  console.log(init);
  if (init.length == 0) {
    init.push([cur]);
  } else {
    let canInsert = false;
    for (var i = 0; i < init.length; i++) {
      rowBooking = init[i];
      console.log("row " + i + " : ", rowBooking);
      for (var j = 0; j < rowBooking.length; j++) {
        console.log("old: ", rowBooking[j]);
        if (
          compareDate(cur.startDate, rowBooking[j].endDate) ||
          compareDate(rowBooking[j].startDate, cur.endDate)
        ) {
          canInsert = true;
        } else {
          canInsert = false;
          break;
        }
      }
      console.log("Can insert: " + canInsert);
      if (canInsert) {
        rowBooking.push(cur);
        break;
      }
    }
    if (!canInsert) init.push([cur]);
  }
  return init;
}, []);
console.log(bookings);
