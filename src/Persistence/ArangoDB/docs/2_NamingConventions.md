# Naming Conventions
## Databases
> Since ArangoDB version 3.9 there is also the extended naming convention, that is disabled by default. It can be enabled on an installation by setting the startup option `--database.extended-names-databases` to `true`.
> > ---
> Once the extended names have been enabled they will remain permanently enabled so that existing databases with extended names remain accessible.
- Traditional Restrictions
  - _Only_ accepts: `/[a-zA-Z0-9_-]/`
  - _Must_ begin with a letter
  - Case Sensitive
- Extended Restrictions
  - Names can consist of most UTF-8 characters, some ASCII characters are disallowed
  - Cannot contain: `/`, `:`, `\n`, `\t`, `\r`, & `\0`
  - Leading or trailing spaces are not allowed
  - `/[0-9_.]/` not allowed as first character
  - Case sensitive
  - maxLen is 128 bytes after normalization. As a UTF-8 character may consist of multiple bytes, this does not necessarily equate to 128 characters.
> Example database names that can be used with the extended naming convention: `"España"`, `"😀"`, `"犬"`, `"كلب"`, "`@abc123"`, `"København"` `"München"`, `"Россия"`, `"abc? <> 123!"`

## Collections & Views
- _Only_ accepts: `/[a-zA-Z0-9_-]/`
- _Must_ begin with a letter
- View names must always start with a letter.
- User-defined collection names must always start with a letter.
- System collection names must start with an underscore.
  - All collection names starting with an underscore are considered to be system collections that are for ArangoDB’s internal use only.
- maxLen is 256 bytes.
- Case Sensitive

## Document Keys
- _Must_ be string
- 1 - 254 bytes long
- `/[a-zA-Z0-9_-:.@()+,=;$!*'%]/`
- _Must_ be unique within the collection it is used in
- Case Sensitive
> Note that if you sort on the _key attribute, string comparison will be used, which means "100" is less than "99" etc.

## Attribute Names
- Case Sensitive
- \> 1 byte
  - No enforced length
    - long attribute names are discouraged due to more memory usage
- Attribute names can include valid UTF-8 string punctuation and special characters
  - For maximum portability, special characters should be avoided
- Attribute names starting with an at-mark (@) will need to be enclosed in backticks when used in an AQL query to tell them apart from bind variables.
  - Recommend avoiding starting with at-marks
    - Though they will work when used properly.
- Attributes starting with an underscore are considered to be internal for the system
> Such attribute names are already used by ArangoDB for special purposes:
> - `_id` is used to contain a document’s handle
> - `_key` is used to contain a document’s user-defined key
> - `_rev` is used to contain the document’s revision number
> - In edge collections, the following attributes are used to reference other documents:
>   - `_from`
>   - `_to`
> ---
> More system attributes may be added in the future without further notice so end users should try to avoid using their own attribute names starting with underscores.