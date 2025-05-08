import classNames from 'classnames';

type ClassValue = string | number | boolean | undefined | null | Record<string, boolean>;

export function cn(...inputs: ClassValue[]) {
  return classNames(inputs);
}
