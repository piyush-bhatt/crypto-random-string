export const URL_SAFE_CHARACTERS =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~".split(
    "",
  );
export const NUMERIC_CHARACTERS = "0123456789".split("");
export const DISTINGUISHABLE_CHARACTERS = "CDEHKMPRTUWXY012458".split("");
export const ASCII_PRINTABLE_CHARACTERS =
  "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~"
    .split("");
export const ALPHANUMERIC_CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");
export const ALLOWED_TYPES = [
  undefined,
  "hex",
  "base64",
  "url-safe",
  "numeric",
  "distinguishable",
  "ascii-printable",
  "alphanumeric",
];
