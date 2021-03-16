export const base64Download = (fileName, data, mime) => {
  const a = window.document.createElement("a");
  a.href = `data:${mime};base64,${data}`;
  a.download = fileName;
  a.click();
};
