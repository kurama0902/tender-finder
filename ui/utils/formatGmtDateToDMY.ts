export function formatGmtDateToDMY(dateString: string) {
 
  const date = new Date(dateString);


  if (isNaN(date.getTime())) {
    return "Недействительная дата";
  }


  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();

  const formattedDay = String(day).padStart(2, "0");
  const formattedMonth = String(month).padStart(2, "0");

  return `${formattedDay}/${formattedMonth}/${year}`;
}