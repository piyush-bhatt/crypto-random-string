# crypto-random-string

> Generate a [cryptographically strong](https://en.wikipedia.org/wiki/Strong_cryptography) random string

Deno module based on [crypto-random-string](https://github.com/sindresorhus/crypto-random-string). Useful for creating an identifier, slug, salt, PIN code, fixture, etc.

## Import Module

```typescript
import { cryptoRandomString } from "https://deno.land/x/crypto_random_string@1.0.0/mod.ts"
// or
import { cryptoRandomString } from "https://github.com/piyush-bhatt/crypto-random-string/raw/main/mod.ts"
```

## Usage

**NOTE:** Outputs shown below are merely examples. The function will generate random string each time.


```typescript

cryptoRandomString({length: 10}); // '0696cb9e70'

cryptoRandomString({length: 10, type: 'base64'}); // 'dw3mgWC5uO'

cryptoRandomString({length: 10, type: 'url-safe'}); // '0pN1Y2Jz.X'

cryptoRandomString({length: 10, type: 'numeric'}); // '1639380067'

cryptoRandomString({length: 6, type: 'distinguishable'}); // 'H4HH5D'

cryptoRandomString({length: 10, type: 'ascii-printable'}); // '#I&J.GP./9'

cryptoRandomString({length: 10, type: 'alphanumeric'}); // 'ZtgC2J6aU5'

cryptoRandomString({length: 10, characters: 'abc'}); // 'abcabccbcc'

```

## API

### cryptoRandomString(options)

Returns a randomized string. [Hex](https://en.wikipedia.org/wiki/Hexadecimal) by default.


#### options

Type: `object`

##### length

*Required*\
Type: `number`

Length of the returned string.

##### type

Type: `string`\
Default: `'hex'`\
Values: `'hex' | 'base64' | 'url-safe' | 'numeric' | 'distinguishable' | 'ascii-printable' | 'alphanumeric'`

Use only characters from a predefined set of allowed characters.

Cannot be set at the same time as the `characters` option.

The `distinguishable` set contains only uppercase characters that are not easily confused: `CDEHKMPRTUWXY012458`. It can be useful if you need to print out a short string that you'd like users to read and type back in with minimal errors. For example, reading a code off of a screen that needs to be typed into a phone to connect two devices.

The `ascii-printable` set contains all [printable ASCII characters](https://en.wikipedia.org/wiki/ASCII#ASCII_printable_characters): ``!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~`` Useful for generating passwords where all possible ASCII characters should be used.

The `alphanumeric` set contains uppercase letters, lowercase letters, and digits: `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`. Useful for generating [nonce](https://developer.mozilla.org/en-US/docs/Web/API/HTMLOrForeignElement/nonce) values.

##### characters

Type: `string`\
Minimum length: `1`\
Maximum length: `65536`

Use only characters from a custom set of allowed characters.

Cannot be set at the same time as the `type` option.

## Licensing

[MIT](https://github.com/piyush-bhatt/crypto-random-string/blob/main/LICENSE) licensed
