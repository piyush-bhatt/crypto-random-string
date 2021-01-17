import { randomBytes } from "./deps.ts";
import { promisify } from "./deps.ts";
import {
  ALLOWED_TYPES,
  ALPHANUMERIC_CHARACTERS,
  ASCII_PRINTABLE_CHARACTERS,
  DISTINGUISHABLE_CHARACTERS,
  NUMERIC_CHARACTERS,
  URL_SAFE_CHARACTERS,
} from "./constants.ts";

const randomBytesAsync = promisify(randomBytes);

const generateForCustomCharacters = (length: number, characters: string[]) => {
  // Generating entropy is faster than complex math operations, so we use the simplest way
  const characterCount = characters.length;
  const maxValidSelector =
    (Math.floor(0x10000 / characterCount) * characterCount) - 1; // Using values above this will ruin distribution when using modular division
  const entropyLength = 2 * Math.ceil(1.1 * length); // Generating a bit more than required so chances we need more than one pass will be really low
  let string = "";
  let stringLength = 0;

  while (stringLength < length) { // In case we had many bad values, which may happen for character sets of size above 0x8000 but close to it
    const entropy = randomBytes(entropyLength);
    let entropyPosition = 0;

    while (entropyPosition < entropyLength && stringLength < length) {
      const entropyValue = entropy.readUInt16LE(entropyPosition);
      entropyPosition += 2;
      if (entropyValue > maxValidSelector) { // Skip values which will ruin distribution when using modular division
        continue;
      }

      string += characters[entropyValue % characterCount];
      stringLength++;
    }
  }

  return string;
};

const generateForCustomCharactersAsync = async (
  length: number,
  characters: string[],
) => {
  // Generating entropy is faster than complex math operations, so we use the simplest way
  const characterCount = characters.length;
  const maxValidSelector =
    (Math.floor(0x10000 / characterCount) * characterCount) - 1; // Using values above this will ruin distribution when using modular division
  const entropyLength = 2 * Math.ceil(1.1 * length); // Generating a bit more than required so chances we need more than one pass will be really low
  let string = "";
  let stringLength = 0;

  while (stringLength < length) { // In case we had many bad values, which may happen for character sets of size above 0x8000 but close to it
    const entropy = await randomBytesAsync(entropyLength); // eslint-disable-line no-await-in-loop
    let entropyPosition = 0;

    while (entropyPosition < entropyLength && stringLength < length) {
      const entropyValue = entropy.readUInt16LE(entropyPosition);
      entropyPosition += 2;
      if (entropyValue > maxValidSelector) { // Skip values which will ruin distribution when using modular division
        continue;
      }

      string += characters[entropyValue % characterCount];
      stringLength++;
    }
  }

  return string;
};

const generateRandomBytes = (
  byteLength: number,
  type: string,
  length: number,
) => randomBytes(byteLength).toString(type).slice(0, length);

const generateRandomBytesAsync = async (
  byteLength: number,
  type: string,
  length: number,
) => {
  const buffer = await randomBytesAsync(byteLength);
  return buffer.toString(type).slice(0, length);
};

const createGenerator = (
  generateForCustomCharacters: Function,
  generateRandomBytes: Function,
) =>
  (
    { length, type, characters }: {
      length: number;
      type?: string;
      characters?: string;
    },
  ) => {
    if (!(length >= 0 && Number.isFinite(length))) {
      throw new TypeError(
        "Expected a `length` to be a non-negative finite number",
      );
    }

    if (type !== undefined && characters !== undefined) {
      throw new TypeError("Expected either `type` or `characters`");
    }

    if (characters !== undefined && typeof characters !== "string") {
      throw new TypeError("Expected `characters` to be string");
    }

    if (!ALLOWED_TYPES.includes(type)) {
      throw new TypeError(`Unknown type: ${type}`);
    }

    if (type === undefined && characters === undefined) {
      type = "hex";
    }

    if (type === "hex") {
      return generateRandomBytes(Math.ceil(length * 0.5), "hex", length); // Need 0.5 byte entropy per character
    }

    if (type === "base64") {
      return generateRandomBytes(Math.ceil(length * 0.75), "base64", length); // Need 0.75 byte of entropy per character
    }

    if (type === "url-safe") {
      return generateForCustomCharacters(length, URL_SAFE_CHARACTERS);
    }

    if (type === "numeric") {
      return generateForCustomCharacters(length, NUMERIC_CHARACTERS);
    }

    if (type === "distinguishable") {
      return generateForCustomCharacters(length, DISTINGUISHABLE_CHARACTERS);
    }

    if (type === "ascii-printable") {
      return generateForCustomCharacters(length, ASCII_PRINTABLE_CHARACTERS);
    }

    if (type === "alphanumeric") {
      return generateForCustomCharacters(length, ALPHANUMERIC_CHARACTERS);
    }

    if (characters !== undefined && characters.length === 0) {
      throw new TypeError(
        "Expected `characters` string length to be greater than or equal to 1",
      );
    }

    if (characters !== undefined && characters.length > 0x10000) {
      throw new TypeError(
        "Expected `characters` string length to be less or equal to 65536",
      );
    }

    return generateForCustomCharacters(length, characters!.split(""));
  };

const cryptoRandomString = createGenerator(
  generateForCustomCharacters,
  generateRandomBytes,
);
const cryptoRandomStringAsync = createGenerator(
  generateForCustomCharactersAsync,
  generateRandomBytesAsync,
);

export { cryptoRandomString, cryptoRandomStringAsync };
