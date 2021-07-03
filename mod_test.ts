import { assertEquals, assertMatch, assertThrows } from "./test_deps.ts";
import { cryptoRandomString } from "./mod.ts";

// Probabilistic, result is always less than or equal to actual set size, chance it is less is below 1e-256 for sizes up to 32656
const generatedCharacterSetSize = (
  options: { type?: string; characters?: string },
  targetSize: number,
) => {
  const set = new Set();
  const length = targetSize * 640;
  const string = cryptoRandomString({ ...options, length });

  for (let i = 0; i < length; i++) {
    set.add(string[i]);
  }

  return set.size;
};

Deno.test("main", () => {
  assertEquals(cryptoRandomString({ length: 0 }).length, 0);
  assertEquals(cryptoRandomString({ length: 10 }).length, 10);
  assertEquals(cryptoRandomString({ length: 100 }).length, 100);
  assertMatch(cryptoRandomString({ length: 100 }), /^[a-f\d]*$/); // Sanity check, probabilistic
  assertEquals(generatedCharacterSetSize({}, 16), 16);
});

Deno.test("hex", () => {
  assertEquals(cryptoRandomString({ length: 0, type: "hex" }).length, 0);
  assertEquals(cryptoRandomString({ length: 10, type: "hex" }).length, 10);
  assertEquals(cryptoRandomString({ length: 100, type: "hex" }).length, 100);
  assertMatch(cryptoRandomString({ length: 100, type: "hex" }), /^[a-f\d]*$/); // Sanity check, probabilistic
  assertEquals(generatedCharacterSetSize({ type: "hex" }, 16), 16);
});

Deno.test("base64", () => {
  assertEquals(cryptoRandomString({ length: 0, type: "base64" }).length, 0);
  assertEquals(cryptoRandomString({ length: 10, type: "base64" }).length, 10);
  assertEquals(cryptoRandomString({ length: 100, type: "base64" }).length, 100);
  assertMatch(
    cryptoRandomString({ length: 100, type: "base64" }),
    /^[a-zA-Z\d/+]*$/,
  ); // Sanity check, probabilistic
  assertEquals(generatedCharacterSetSize({ type: "base64" }, 64), 64);
});

Deno.test("url-safe", () => {
  assertEquals(cryptoRandomString({ length: 0, type: "url-safe" }).length, 0);
  assertEquals(cryptoRandomString({ length: 10, type: "url-safe" }).length, 10);
  assertEquals(
    cryptoRandomString({ length: 100, type: "url-safe" }).length,
    100,
  );
  assertMatch(
    cryptoRandomString({ length: 100, type: "url-safe" }),
    /^[a-zA-Z\d._~-]*$/,
  ); // Sanity check, probabilistic
  assertEquals(generatedCharacterSetSize({ type: "url-safe" }, 66), 66);
});

Deno.test("numeric", () => {
  assertEquals(cryptoRandomString({ length: 0, type: "numeric" }).length, 0);
  assertEquals(cryptoRandomString({ length: 10, type: "numeric" }).length, 10);
  assertEquals(
    cryptoRandomString({ length: 100, type: "numeric" }).length,
    100,
  );
  assertMatch(cryptoRandomString({ length: 100, type: "numeric" }), /^[\d]*$/); // Sanity check, probabilistic
  assertEquals(generatedCharacterSetSize({ type: "numeric" }, 10), 10);
});

Deno.test("distinguishable", () => {
  assertEquals(
    cryptoRandomString({ length: 0, type: "distinguishable" }).length,
    0,
  );
  assertEquals(
    cryptoRandomString({ length: 10, type: "distinguishable" }).length,
    10,
  );
  assertEquals(
    cryptoRandomString({ length: 100, type: "distinguishable" }).length,
    100,
  );
  assertMatch(
    cryptoRandomString({ length: 100, type: "distinguishable" }),
    /^[CDEHKMPRTUWXY012458]*$/,
  ); // Sanity check, probabilistic
  assertEquals(generatedCharacterSetSize({ type: "distinguishable" }, 19), 19);
});

Deno.test("ascii-printable", () => {
  assertEquals(
    cryptoRandomString({ length: 0, type: "ascii-printable" }).length,
    0,
  );
  assertEquals(
    cryptoRandomString({ length: 10, type: "ascii-printable" }).length,
    10,
  );
  assertEquals(
    cryptoRandomString({ length: 100, type: "ascii-printable" }).length,
    100,
  );
  assertMatch(
    cryptoRandomString({ length: 100, type: "ascii-printable" }),
    /^[!"#$%&'()*+,-./\d:;<=>?@A-Z[\\\]^_`a-z{|}~]*$/,
  ); // Sanity check, probabilistic
});

Deno.test("alphanumeric", () => {
  assertEquals(
    cryptoRandomString({ length: 0, type: "alphanumeric" }).length,
    0,
  );
  assertEquals(
    cryptoRandomString({ length: 10, type: "alphanumeric" }).length,
    10,
  );
  assertEquals(
    cryptoRandomString({ length: 100, type: "alphanumeric" }).length,
    100,
  );
  assertMatch(
    cryptoRandomString({ length: 100, type: "alphanumeric" }),
    /^[ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789]*$/,
  ); // Sanity check, probabilistic
  assertEquals(generatedCharacterSetSize({ type: "alphanumeric" }, 19), 62);
});

Deno.test("characters", () => {
  assertEquals(cryptoRandomString({ length: 0, characters: "1234" }).length, 0);
  assertEquals(
    cryptoRandomString({ length: 10, characters: "1234" }).length,
    10,
  );
  assertEquals(
    cryptoRandomString({ length: 100, characters: "1234" }).length,
    100,
  );
  assertMatch(
    cryptoRandomString({ length: 100, characters: "1234" }),
    /^[1-4]*$/,
  ); // Sanity check, probabilistic
  assertEquals(generatedCharacterSetSize({ characters: "1234" }, 4), 4);
  assertEquals(generatedCharacterSetSize({ characters: "0123456789" }, 10), 10);
});

Deno.test("argument errors", () => {
  assertThrows(() => {
    cryptoRandomString({ length: Infinity });
  });

  assertThrows(() => {
    cryptoRandomString({ length: -1 });
  });

  assertThrows(() => {
    cryptoRandomString({ length: 0, type: "hex", characters: "1234" });
  });

  assertThrows(() => {
    cryptoRandomString({ length: 0, type: "unknown" });
  });
});
