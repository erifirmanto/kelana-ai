export type DestinationHero = {
  image: string;
  credit: string;
};

const UNSPLASH = "https://images.unsplash.com";

const heroes: Record<string, DestinationHero> = {
  kajang: {
    image: `${UNSPLASH}/photo-1596979182412-4ebbb53a620a?auto=format&fit=crop&w=1800&q=82`,
    credit: "Photo by Ravin Rau on Unsplash",
  },
  malaysia: {
    image: `${UNSPLASH}/photo-1681149421160-a7cb92568a86?auto=format&fit=crop&w=1800&q=82`,
    credit: "Photo by Filipe Freitas on Unsplash",
  },
  japan: {
    image: `${UNSPLASH}/photo-1551106368-d9157e48a3ca?auto=format&fit=crop&w=1800&q=82`,
    credit: "Photo by Nic Y-C on Unsplash",
  },
  singapore: {
    image: `${UNSPLASH}/photo-1667382042303-30044367b46f?auto=format&fit=crop&w=1800&q=82`,
    credit: "Photo by JL Leong on Unsplash",
  },
  bali: {
    image: `${UNSPLASH}/photo-1711658450992-3c17ed5fd72b?auto=format&fit=crop&w=1800&q=82`,
    credit: "Photo by Lina Bob on Unsplash",
  },
  indonesia: {
    image: `${UNSPLASH}/photo-1782909079129-adee40cd79f5?auto=format&fit=crop&w=1800&q=82`,
    credit: "Photo by Salman Rameli on Unsplash",
  },
  paris: {
    image: `${UNSPLASH}/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1800&q=82`,
    credit: "Photo by Chris Karidis on Unsplash",
  },
};

const aliases: Array<[string, keyof typeof heroes]> = [
  ["kajang", "kajang"],
  ["selangor", "malaysia"],
  ["kuala lumpur", "malaysia"],
  ["malaysia", "malaysia"],
  ["kyoto", "japan"],
  ["tokyo", "japan"],
  ["osaka", "japan"],
  ["japan", "japan"],
  ["singapore", "singapore"],
  ["bali", "bali"],
  ["denpasar", "bali"],
  ["ubud", "bali"],
  ["indonesia", "indonesia"],
  ["paris", "paris"],
  ["france", "paris"],
];

const fallback: DestinationHero = {
  image:
    `${UNSPLASH}/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1800&q=82`,
  credit: "Photo from Unsplash",
};

export function getDestinationHero(destination: string): DestinationHero {
  const normalized = destination.toLowerCase().trim();

  for (const [keyword, heroKey] of aliases) {
    if (normalized.includes(keyword)) {
      return heroes[heroKey];
    }
  }

  return fallback;
}
