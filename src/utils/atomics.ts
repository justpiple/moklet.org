/* eslint-disable @typescript-eslint/no-explicit-any */
import { randomFillSync } from "crypto";

// Region Date relateds
export function getMonthName(month: number) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return months[month];
}

export function stringifyDate(date: Date) {
  const year = date.getFullYear(),
    month = getMonthName(date.getMonth()),
    day = date.getDate();
  return `${month} ${day}, ${year}`;
}
// Endregion

export function stringifyCompleteDate(date: Date) {
  const year = date.getFullYear(),
    month = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2),
    hour = ("0" + date.getHours()).slice(-2),
    minute = ("0" + date.getMinutes()).slice(-2);
  return `${year}/${month}/${day} at ${hour}:${minute}`;
}

//#region Pagination relateds
export function isInteger(value: string) {
  return /^\d+$/.test(value);
}

export function validatePage(page: string) {
  return isInteger(page) && parseInt(page) > 0;
}
//#endregion

export function generateRandomString(length: number): string {
  const buffer = Buffer.alloc(length);
  randomFillSync(buffer);

  return buffer.toString("base64").slice(0, length);
}

export const formToJSON = (elements: HTMLElement) =>
  [].reduce.call(
    elements,
    (data: any, element: HTMLInputElement) => {
      data[element.name] =
        element.type == "checkbox"
          ? data[element.name]
            ? element.checked
              ? [...data[element.name], element.value]
              : data[element.name].filter(
                  (value: string) => value !== element.value,
                )
            : element.checked
              ? [element.value]
              : []
          : element.type == "radio"
            ? element.checked
              ? element.value
              : data[element.name]
            : element.value;
      return data;
    },
    {},
  ) as Array<string | Array<string>>;

export const convertToDateTimeLocalString = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const countElements = (arr: any[]) => {
  const uniqueElements = Array.from(new Set(arr));
  const counts = uniqueElements.map((element) => ({
    value: element,
    count: arr.filter((item) => item === element).length,
  }));

  return counts;
};

export const transformToArrayCheckbox = (inputArray: Array<any>) => {
  return inputArray.reduce((acc, { field_id, value }) => {
    const group = acc.find(
      (group: { field_id: string }) => group.field_id === field_id,
    );

    if (group) {
      group.value = Array.isArray(group.value)
        ? group.value.concat(value)
        : [group.value, value];
    } else {
      acc.push({ field_id, value });
    }
    return acc;
  }, []);
};

export function arrayMove<T>(
  arr: T[],
  oldIndex: number,
  newIndex: number,
): T[] {
  if (newIndex >= arr.length) {
    let k = newIndex - arr.length + 1;
    while (k--) {
      arr.push(undefined as unknown as T);
    }
  }
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
  return arr; // for testing
}

export function slugify(str: string, separator = "-") {
  str = str.replace(/^\s+|\s+$/g, ""); // trim leading/trailing white space
  str = str.toLowerCase(); // convert string to lowercase
  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove any non-alphanumeric characters
    .replace(/\s+/g, separator) // replace spaces with hyphens
    .replace(/-+/g, separator); // remove consecutive hyphens
  return str;
}

//#region file size converter
export function fileSizeToMb(fileSize: number) {
  return parseFloat((fileSize / (1024 * 1024)).toFixed(2));
}
//#endregion

export function trimName(name: string) {
  const splitName = name.split(" ");
  const trimmedName = splitName[0] + " " + splitName[1];
  return trimmedName;
}

export function getDateMonths(date: Date, months: number) {
  date.setMonth(date.getMonth() + months);
  return date;
}

export function getDateDaysAgoMore(date: Date, days: number) {
  date.setDate(date.getDate() + days);
  return date;
}

export const stripMarkdown = (markdown: string) => {
  return markdown
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]+)\]\(.*?\)/g, "$1")
    .replace(/`{3}.*\n?/g, "")
    .replace(/`(.+?)`/g, "$1")
    .replace(/[*_~`#>-]/g, "")
    .replace(/\n+/g, " ")
    .trim();
};
