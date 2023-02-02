const getFileNameAndExtFromUrl = (str) => {
  if (!str) return [];
  let file = str.split('/').pop();
  return [
    file.substr(0, file.lastIndexOf('.')),
    file.substr(file.lastIndexOf('.') + 1, file.length),
  ];
};
export default getFileNameAndExtFromUrl;
