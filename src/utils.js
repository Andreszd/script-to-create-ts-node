function replaceVariableTextFragment(text, valuesToReplace) {
  try {
    if (typeof text !== 'string') return '';

    const regex = /:\w+/g;
    const vars = text.match(regex);
    if (!vars?.length) return text;

    let textToFormat = text;

    vars.forEach((variable) => {
      textToFormat = textToFormat.replace(
        variable,
        valuesToReplace[variable?.replace(/[^a-zA-Z0-9]/g, '')] ?? ''
      );
    });
    return textToFormat;
  } catch (error) {
    console.error(error);
    return text;
  }
}

module.exports = {
  replaceVariableTextFragment,
};
