const getUrlExtension = (url) => {
  if (!url) return '';
  return url.split(/[#?]/)[0].split('.').pop().trim();
};
export default getUrlExtension;
