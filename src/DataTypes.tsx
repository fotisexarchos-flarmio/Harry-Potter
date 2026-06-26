export interface Trait {
  id: string;
  name: string;
}

export interface House {
  id: string;
  name: string;
  houseColours: string | null;
  founder: string | null;
  animal: string | null;
  traits: Trait[];
  [key: string]: any;
}