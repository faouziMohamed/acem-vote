const setStartCase = (txt) =>
  txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();

export const startCase = (str) => str.replace(/\w\S*/g, setStartCase);
export const capitalize = (str) => setStartCase(str);
export const removeTrailingSlash = (str) => str.replace(/\/$/, '');
export const removeExtraSpaces = (str) => str.replace(/\s+/g, ' ');
export const pow = (x, y) => x ** y;
export const isEmpty = (str) => !str || str.trim().length === 0;
export const round = (n, precision) => {
  const prec = pow(10, precision);
  return Math.round(n * prec) / prec;
};

export function golfyNumber(number) {
  const n = Number(number);
  const { floor, abs, log } = Math;
  const abbrev = 'kmb';
  let base = floor(log(abs(n)) / log(1000));
  const suffix = abbrev[Math.min(2, base - 1)];
  base = abbrev.indexOf(suffix) + 1;
  return suffix ? round(n / pow(1000, base), 2) + suffix : `${n}`;
}

export async function disconnectUser(mutate) {
  await fetch('/api/logout');
  window.location = '/';
  mutate({ user: null });
}

export const appendZero = (num) => (num < 10 ? `0${num}` : num);
export const timeToMs = (time) => {
  const [hours, minutes, seconds] = time.split(':');
  if (Number.isNaN(hours) || Number.isNaN(minutes) || Number.isNaN(seconds)) {
    throw new Error('Invalid time');
  }
  return (
    Number(hours) * 3600000 +
    Number(minutes) * 60000 +
    (Number(seconds) * 1000 || 0)
  );
};

// email regex from https://emailregex.com/index.html
export const emailRegex = () =>
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const emailValidator = (email) => emailRegex().test(email);

// Phone number begining with 06 or 07 (Only moroccan numbers)
export const phoneRegex = () => /^(0[67])([0-9]{8})$/;
export const phoneValidator = (phone) => phoneRegex().test(phone);

export const clearConsole = () => {
  // eslint-disable-next-line no-console
  console.clear();
};
