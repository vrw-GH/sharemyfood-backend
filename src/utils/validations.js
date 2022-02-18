const validateElements = (element, fields, toUpdate) => {
  const tester = element;
  try {
    // console.log(JSON.stringify(tester)); // if not json.
    fields.forEach((e) => {
      const field = e[0];
      const creation = e[1];
      const updatable = e[2];
      // console.log(
      //   "validation for",
      //   toUpdate ? "Updating" : "Creating",
      //   ": <",
      //   field,
      //   creation ? "> needed" : "> notneeded",
      //   updatable ? "canupdate" : "cannotupdate"
      // );
      // console.log(field, ":", tester[field]);
      if (toUpdate) {
        // when updating
        if (tester[field] !== undefined) {
          if (!updatable) {
            const msg = `Update <${field}> disallowed.`;
            console.log(msg);
            throw Error(msg);
          }
          if (creation && !tester[field]) {
            const msg = `<${field}> has error: (${tester[field]})`;
            console.log(msg);
            throw Error(msg);
          }
        }
      } else {
        // when creating
        if (creation && !tester[field]) {
          const msg = `<${field}> has error: (${tester[field]})`;
          console.log(msg);
          throw Error(msg);
        }
      }
    });
    // other validations
    return element;
  } catch (e) {
    throw Error(`Data validation failed- ${e.message}.`);
  }
};

export default validateElements;
