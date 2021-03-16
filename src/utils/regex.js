// Email Regex Expression
const EMAIL = /^([a-zA-Z0-9_\-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

// Number Regex Expression
const NUMERIC = /^[0-9]*$/;

// Alphabet with dot and space for names
const ALPHA = /^[a-zA-Z. ]*$/;

// Only Alphabet
// const ALPHA_ONLY = /^[a-zA-Z]{2,15}*$/
const ALPHA_ONLY = /^[a-zA-Z]{1,15}$/

// Alpha Numeric
const ALPHA_NUMERIC = /^[a-zA-Z0-9]*$/;

const ALPHA_WITH_EMPTY_CHAR = /^[a-zA-Z]{0,15}$/

export const checkEmail = email => EMAIL.test(email)

export const checkNumberOnly = (number) => NUMERIC.test(number);

export const checkAlphabetsWithDotAndSpace = (text) => ALPHA.test(text);

export const checkAlphaOnly = (char) => ALPHA_ONLY.test(char);

export const checkAlphaWithEmptyChar = char => ALPHA_WITH_EMPTY_CHAR.test(char)

export const checkAphaNumeric = char => ALPHA_NUMERIC.test(char)
