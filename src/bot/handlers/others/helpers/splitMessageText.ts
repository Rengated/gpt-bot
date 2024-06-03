export const splitMessageText = (text: string) => {
    const maxLength = 4000;
    const partsOfText = [];
    while (text.length > maxLength) {
      let sliceText = text.slice(0, maxLength);
      let indexLastSpace = sliceText.lastIndexOf(" ");
      sliceText = text.slice(0,indexLastSpace);
      partsOfText.push(sliceText);
      text = text.substring(indexLastSpace);//убираем текст который напечатали
    }
    partsOfText.push(text);
    return partsOfText;
  };