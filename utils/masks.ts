export type MaskType = 'phone';

export const applyMask = (type: MaskType, value: string): string => {
  switch (type) {
    case 'phone':
      return phoneMask(value);
    default:
      return value;
  }
};

const phoneMask = (value: string): string => {
  if (!value) {
    return '';
  }
  const onlyNums = value.replace(/[^\d]/g, '');
  if (onlyNums.length <= 2) {
    return `(${onlyNums}`;
  }
  if (onlyNums.length <= 7) {
    return `(${onlyNums.slice(0, 2)}) ${onlyNums.slice(2)}`;
  }
  return `(${onlyNums.slice(0, 2)}) ${onlyNums.slice(2, 7)}-${onlyNums.slice(7, 11)}`;
};
