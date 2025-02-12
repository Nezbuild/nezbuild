export const addSpacesBeforeCapitals = (str) => 
  str.replace(/([A-Z])/g, (match, p1, offset) => 
    offset === 0 ? p1 : ` ${p1}`
  );

  export const truncateName = (name) => {
    if (!name) return '';  // Avoid errors if name is undefined/null
    const words = name.trim().split(' ');
    return words.length > 1 ? words.slice(1).join('') : words[0];
  };
  
   

export const getGearImage = (name) => {
  const truncatedName = truncateName(name).toLowerCase();
  return `/assets/images/${truncatedName}.png`;
};
