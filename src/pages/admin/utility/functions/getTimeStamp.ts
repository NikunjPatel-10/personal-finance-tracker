import {
  differenceInHours,
  differenceInMinutes,
  format,
  parseISO,
} from 'date-fns';

export const getTimeStamp = (timestamp: any) => {
  // Parse the ISO string and adjust to IST (UTC+5:30)
  const istDate = parseISO(timestamp); // 330 minutes = 5 hours 30 minutes
  const nowIST = new Date(); // Adjust the current time to IST

  const minutesDifference = differenceInMinutes(nowIST, istDate);

  if (minutesDifference < 1) {
    return 'Now';
  } else if (minutesDifference < 60) {
    return `${minutesDifference} min${minutesDifference > 1 ? 's' : ''} ago`;
  } else if (differenceInHours(nowIST, istDate) <= 23) {
    const hoursDifference = differenceInHours(nowIST, istDate);
    return `${hoursDifference} hr${hoursDifference > 1 ? 's' : ''} ago`;
  } else {
    return format(istDate, 'MMM d');
  }
};
