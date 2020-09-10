import React from 'react';
import classnames from 'classnames';

const WEEK_SIZE = 7;
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const WEEK_DAYS_FROM_MONDAY = [6, 0, 1, 2, 3, 4, 5];
const MonthEnum = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  Novermber: 10,
  December: 11,
};

function Calendar({ date, years, months, daysOfWeek }) {
  const [calendarDate, setCalendarDate] = React.useState(date);
  const [selectedDates, setSelectedDates] = React.useState(
    JSON.parse(localStorage.getItem('selectedDates')).map((date) => new Date(parseInt(date))),
  );
  const currentDate = new Date();

  const checkIfCurrentMonth = (date) => calendarDate.getMonth() === date.getMonth();

  const checkIfDatesEqual = (a, b) => {
    if (!a || !b) return false;
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  };

  const getWeekDay = (date) => {
    return WEEK_DAYS_FROM_MONDAY[date.getDay()];
  };

  const checkIfLeapYear = (year) => !(year % 4 || (!(year % 100) && year % 400));

  const getMonthSize = (date) => {
    const month = date.getMonth();
    const daysInMonth = DAYS_IN_MONTH[month];

    if (checkIfLeapYear && month === MonthEnum.February) {
      return daysInMonth + 1;
    }
    return daysInMonth;
  };

  const getMonthData = (year, month) => {
    const resultData = [];
    const tempData = new Date(year, month);
    const monthSize = getMonthSize(tempData);
    const monthStart = getWeekDay(tempData);
    const prevMonth = month === 0 ? 11 : month - 1;
    const nextMonth = month === 11 ? 0 : month + 1;
    let prevMonthDay = DAYS_IN_MONTH[prevMonth];
    let nextMonthDay = 1;
    let day = 1;

    for (let i = 0; i < (monthSize + monthStart) / WEEK_SIZE; i++) {
      resultData[i] = [];
      for (let j = 0; j < WEEK_SIZE; j++) {
        if (i === 0 && j < monthStart) {
          resultData[i][j] = new Date(year, prevMonth, prevMonthDay - monthStart + j + 1);
        } else if (day > monthSize) {
          resultData[i][j] = new Date(year, nextMonth, nextMonthDay++);
        } else {
          resultData[i][j] = new Date(year, month, day++);
        }
      }
    }

    return resultData;
  };

  const changePrevMonth = () => {
    const newDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1);
    setCalendarDate(newDate);
  };

  const changeNextMonth = () => {
    const newDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1);
    setCalendarDate(newDate);
  };

  const clickOnDay = (event, date) => {
    if (event.shiftKey && !checkIfDatesEqual(selectedDates[0], date)) {
      const newDates = [selectedDates[0]];
      while (true) {
        const tmpDate = new Date(newDates[newDates.length - 1].getTime());
        if (date > selectedDates[0]) {
          tmpDate.setDate(tmpDate.getDate() + 1);
        } else {
          tmpDate.setDate(tmpDate.getDate() - 1);
        }
        newDates.push(new Date(tmpDate.getTime()));
        if (
          (date > selectedDates[0] && tmpDate >= date) ||
          (date < selectedDates[0] && tmpDate <= date)
        )
          break;
      }
      setSelectedDates(newDates);
      localStorage.setItem('selectedDates', JSON.stringify(newDates.map((date) => date.getTime())));
    } else {
      const newDates = [date];
      setSelectedDates(newDates);
      localStorage.setItem('selectedDates', JSON.stringify(newDates.map((date) => date.getTime())));
    }
  };

  const month = getMonthData(calendarDate.getFullYear(), calendarDate.getMonth());
  return (
    <div className="calendar">
      <header className="calendar__header">
        <button className="calendar__button" onClick={changePrevMonth}>
          <svg
            width="6"
            height="10"
            viewBox="0 0 6 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.5575 8.4425L2.1225 5L5.5575 1.5575L4.5 0.5L0 5L4.5 9.5L5.5575 8.4425Z"
              fill="#707070"
            />
          </svg>
        </button>
        <div className="calendar__date">
          <span className="calendar__month">{months[calendarDate.getMonth()]}</span>
          <span className="calendar__year">{calendarDate.getFullYear()}</span>
        </div>
        <button className="calendar__button" onClick={changeNextMonth}>
          <svg
            width="6"
            height="10"
            viewBox="0 0 6 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M-4.76837e-06 1.5575L3.435 5L-4.76837e-06 8.4425L1.0575 9.5L5.5575 5L1.0575 0.5L-4.76837e-06 1.5575Z"
              fill="#707070"
            />
          </svg>
        </button>
      </header>

      <table className="calendar__month-data">
        <thead>
          <tr>
            {daysOfWeek.map((dayName, index) => (
              <th className="calendar__day-of-week" key={`${dayName}_${index}`}>
                {dayName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {month.map((week, index) => (
            <tr key={index}>
              {week.map((date, index) => (
                <td
                  key={`${date.valueOf()}_${index}`}
                  onClick={(event) => {
                    clickOnDay(event, date);
                  }}
                  className={classnames('calendar__day', {
                    calendar__day_today: checkIfDatesEqual(date, currentDate),
                    calendar__day_selected: selectedDates.some((selectedDate) =>
                      checkIfDatesEqual(selectedDate, date),
                    ),
                    'calendar__day_different-month': !checkIfCurrentMonth(date),
                  })}>
                  {date.getDate()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

Calendar.defaultProps = {
  date: new Date(),
  years: [2017, 2018, 2019, 2020, 2021, 2022, 2023],
  months: [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ],
  daysOfWeek: ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'],
};

export default Calendar;
