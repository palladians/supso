import { format } from "date-fns";
const formatDate = (date) => {
  return format(new Date(parseInt(date)), "PPp");
};
const formatDateShort = (date) => {
  return format(new Date(parseInt(date)), "P");
};
export {
  formatDateShort as a,
  formatDate as f
};
