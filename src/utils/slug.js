export const createSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, "-and-") 
    .replace(/[\s\W-]+/g, "-"); 
};