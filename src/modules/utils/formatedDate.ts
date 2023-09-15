export const formatedDateYearMontDay = (
  date: string | Date,
  plusOneDay?: boolean,
) => {
  const dateActual = new Date(date);
  const year = dateActual.getFullYear();
  const month = String(dateActual.getMonth() + 1).padStart(2, '0');
  const day = String(dateActual.getDate()).padStart(2, '0');
  const dateFormated = `${year}-${month}-${day}`;

  if (plusOneDay) {
    const countPlusOneDay = 24 * 60 * 60 * 1000;
    const newDateFormated = new Date(dateFormated);
    const dateActualPlusOneDay = new Date(
      newDateFormated.getTime() + countPlusOneDay,
    );

    const dateActualPlusDate = new Date(dateActualPlusOneDay);
    const yearPlusDay = dateActualPlusDate.getFullYear();
    const monthPlusDay = String(dateActualPlusDate.getMonth() + 1).padStart(
      2,
      '0',
    );
    const dayPlusDay = String(dateActualPlusDate.getDate()).padStart(2, '0');
    const dateFormatedPlusDay = `${yearPlusDay}-${monthPlusDay}-${dayPlusDay}`;

    return dateFormatedPlusDay;
  }

  return dateFormated;
};
