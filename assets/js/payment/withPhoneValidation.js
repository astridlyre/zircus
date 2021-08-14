/*
  * withPhoneValidation - validates text input telephone type
  *
  * - adds a space after the first 3 numbers
  * - adds a space after the next 3 numbers
  * - makes sure if the phone number is 9 or 10 characters long that it is
  *   reformatted correctly.
*/
export default function withPhoneValidation() {
  const isNums = (str) => /^[0-9]+$/.test(str);
  const addSpaces = (num) =>
    num.substring(0, 3) + " " +
    num.substring(3, 6) + " " +
    num.substring(6);

  return {
    validatePhone(event) {
      const { target, inputType, data } = event;

      if (inputType === "insertText" && !isNums(data)) {
        target.value = target.value.substring(0, target.value.length - 1);
        return;
      }

      if (inputType === "deleteContentBackward") {
        return;
      }

      switch (target.value.length) {
        case 3:
          target.value = target.value + " ";
          break;
        case 4:
          target.value = target.value.endsWith(" ")
            ? target.value
            : target.value.substring(0, 3) + " " + target.value[3];
          break;
        case 7:
          target.value = target.value + " ";
          break;
        case 8:
          target.value = target.value.endsWith(" ")
            ? target.value
            : target.value.substring(0, 7) + " " + target.value[7];
          break;
        case 10:
          isNums(target.value) &&
            (target.value = addSpaces(target.value));
          break;
        case 11:
          isNums(target.value) &&
            (target.value = addSpaces(target.value.substring(1)));
          break;
      }
    },
  };
}
