export const isValidCSSColor = (colorStr: string): boolean => {
  if (typeof window === 'undefined') return false;
  const s = new Option().style;
  s.color = colorStr.toLowerCase();
  return s.color !== '';
};

export const getHouseGradient = (coloursString: string | null | undefined): string => {
  const defaultGradient = 'linear-gradient(to right, #ffffff, #000000)';
  
  if (!coloursString) return defaultGradient;

  const colors = coloursString.split(' and ').map(c => c.trim().toLowerCase());

  if (colors.length === 2 && isValidCSSColor(colors[0]) && isValidCSSColor(colors[1])) {
    return `linear-gradient(to right, ${colors[0]}, ${colors[1]})`;
  }

  return defaultGradient;
};