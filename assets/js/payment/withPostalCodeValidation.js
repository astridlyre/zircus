export default function withPostalCodeValidation() {
  const CANADA_POSTAL_CODE = /^[A-Za-z][0-9][A-Za-z] ?[0-9][A-Za-z][0-9]$/;
  const isNums = (str) => /^[0-9]+$/.test(str);
  const isAlpha = (str) => /^[A-Za-z]+$/.test(str);
  const butLast = (str) => str.substring(0, str.length - 1);
  const isValidPostalCode = (str) => {
    str = str.replace(" ", "");
    return str.length % 2
      ? isAlpha(str[str.length - 1])
      : isNums(str[str.length - 1]);
  };
  const validatePostalCode = (value) =>
    !isValidPostalCode(value) ? value.substring(0, value.length - 1) : value;

  return {
    validatePostalCode(event, country) {
      const { target, inputType } = event;

      if (inputType === "deleteContentBackward") {
        return;
      }

      if (country === "Canada") {
        target.value = target.value.toUpperCase();
        switch (target.value.length) {
          case 1:
          case 2:
            target.value = validatePostalCode(target.value);
            break;
          case 3:
            target.value = validatePostalCode(target.value);
            target.value = target.value.length === 3
              ? target.value + " "
              : target.value;
            break;
          case 4:
          case 5:
          case 6:
            target.value = validatePostalCode(target.value);
            target.value = target.value.length === 6
              ? CANADA_POSTAL_CODE.test(target.value)
                ? target.value.substring(0, 3) + " " +
                  target.value.substring(3, 6)
                : target.value
              : target.value;
            break;
          case 7:
            target.value = validatePostalCode(target.value);
            break;
        }
      } else if (country === "United States") {
        switch (target.value.length) {
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
            target.value = isNums(target.value)
              ? target.value
              : butLast(target.value);
            break;
          case 6:
            target.value = target.value.endsWith("-")
              ? target.value
              : butLast(target.value);
            break;
          case 7:
          case 8:
          case 9:
            target.value = isNums(target.value) && !target.value.includes("-")
              ? target.value.substring(0, 5) + "-" + target.value.substring(5)
              : target.value;
            /* falls through */
          case 10:
            target.value = isNums(target.value.replace("-", ""))
              ? target.value
              : butLast(target.value);
        }
      }
    },
  };
}
