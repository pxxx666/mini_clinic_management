import moment from 'moment';

export function getDayOfWeek(dateString) {
  const date = moment(dateString);
  return date.day() + ''; // 返回0(周日)到6(周六)的数字
}
