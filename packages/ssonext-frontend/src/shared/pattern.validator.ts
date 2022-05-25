import type { ValidationErrors } from 'svelte-use-form';

function isString(x) {
  return Object.prototype.toString.call(x) === '[object String]';
}

export function pattern(regexp: string | RegExp, name = 'pattern') {
  const r = isString(regexp) ? new RegExp(regexp) : regexp;
  return (value: string): null | ValidationErrors => {
    return (r as RegExp).test(value) ? null : { [name]: 'Pattern error' };
  };
}

export const oneUppercaseOf8 = pattern(/^(?=.*?[A-Z]).{8,}$/, 'one-uppercase');
export const oneLowercaseOf8 = pattern(/^(?=.*?[a-z]).{8,}$/, 'one-lowercase');
export const oneNumberOf8 = pattern(/^(?=.*?[0-9]).{8,}$/, 'one-number');
export const oneSpecialOf8 = pattern(/^(?=.*?[#?!@$%^&*-]).{8,}$/, 'one-special');
