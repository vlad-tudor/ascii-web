import { onMount } from 'solid-js';
import './App.scss';
import { createStore } from 'solid-js/store';
import {
  createGrid,
  createParticle,
  ParticleType,
  updateSmokeParticle,
  getParticleChar,
  Particle,
} from './particleUtils';

const [GRID_WIDTH, GRID_HEIGHT] = [20, 10];
function App() {
  // create a 10x10 grid of random characters

  const [store, setStore] = createStore({
    grid: createGrid('.', GRID_WIDTH, GRID_HEIGHT),
    particles: [] as Particle[],
  });

  /**
   * Updates a particle, make sure it's within the grid
   * @param particle
   * @returns
   */
  const updateGridParticle = (particle: Particle) => {
    const { x, y, dx, dy, type } = particle;
    // make sure the particle is within the grid
    const newX = x + dx;
    const newY = y + dy;
    const gridLength = store.grid.length;
    if (newX < 0 || newX >= gridLength || newY < 0 || newY >= gridLength) {
      return;
    }
    setStore('grid', newX, newY, getParticleChar(type));
  };

  /**
   * Resets the grid with a . at a position
   * @param particle
   */
  const resetGridAtParticle = (particle: Particle) => {
    const { x, y, dx, dy } = particle;
    setStore('grid', x + dx, y + dy, '.');
  };

  /**
   * Adds a new particle at the end of the array
   * @param particle
   */
  const addNewParticles = (particle: Particle) => {
    setStore('particles', store.particles.length, particle);
  };

  /**
   * TODO: specify a range & a function.
   * @param numberOfParticles
   * @returns
   */
  const generateSmokeParticles = (numberOfParticles: 5) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < numberOfParticles; i++) {
      const particleRandomXPosition = Math.floor(Math.random() * (GRID_WIDTH - 1));
      const newParticle = createParticle(particleRandomXPosition, GRID_HEIGHT - 1, ParticleType.Smoke);
      newParticles.push(newParticle);
    }
    return newParticles;
  };

  onMount(() => {
    setInterval(() => {
      // new particles are generated here.
      // TODO: add to a bespoke smoke particle layer
      const particles = generateSmokeParticles(5);
      setStore('particles', [...store.particles, ...particles]);

      // particles are updated here. This should instead happen in a separate function
      // in an external store
      const newParticles: Particle[] = [];
      for (const particle of store.particles) {
        resetGridAtParticle(particle);
        const newParticle = updateSmokeParticle(particle);

        if (newParticle) {
          newParticles.push(newParticle);
        }
      }

      setStore('particles', newParticles);

      for (const particle of store.particles) {
        updateGridParticle(particle);
      }
    }, 100);
  });
  // render the grid
  return (
    <div class="grid" style={{ display: 'flex' }}>
      {store.grid.map((row) => (
        <div class="row">
          {row.map((cell) => (
            <div class="cell">{cell}</div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
