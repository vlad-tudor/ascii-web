export type Grid = string[][];

export enum ParticleType {
  Smoke,
  Solid,
}

export type Particle = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  type: ParticleType;
};

export const createParticle = (x: number, y: number, type: ParticleType) => ({
  x,
  y,
  dx: 0,
  dy: 0,
  type,
});

export const createGrid = (char: string, width = 10, height = 10) =>
  Array.from({ length: width }, () =>
    Array.from({ length: height }, () => char || String.fromCharCode(Math.floor(Math.random() * 26) + 65)),
  );

export const getParticleChar = (particleType: ParticleType) => {
  switch (particleType) {
    case ParticleType.Smoke:
      return '@';
    case ParticleType.Solid:
      return '🪨';
  }
};

/**
 * Should also perhaps update left/right by one particle?
 * @param particle
 * @returns
 */
export const updateSmokeParticle = (particle: Particle): Particle | undefined => {
  const { x, dx, dy } = particle;
  const distanceFromOrigin = x - dx;
  const smokeWigglyness = 6 - distanceFromOrigin;
  const directionVibe = Math.random() * smokeWigglyness - smokeWigglyness / 2;

  let newDx = dx;
  //   if (directionVibe > 0) {
  //     newDx = dx + 1;
  //   } else {
  //     newDx = dx - 1;
  //   }
  // if the particle is too far from the origin, in both x and y, reset it

  if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
    return { ...particle, dx: newDx, dy: dy - 1 };
  }
};
