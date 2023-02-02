const formatSlug = value => {
  return value ? value.toLowerCase()?.replace(/_/g, "-") : null;
};

export default formatSlug;
