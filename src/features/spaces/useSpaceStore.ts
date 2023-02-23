import { PlanetId } from "../planet_ids/PlanetId.value";

import { createPlanetState } from "../planets/createPlanetState";
import {
  type PlanetStore,
  composePlanetStore,
} from "../planets/usePlanetStore";

export type SpaceStore = {
  useAstronomicalObjectStore: (
    this: void,
    astronomicalObjectId: PlanetId
  ) => PlanetStore;
};

export function useSpaceStore(): SpaceStore {
  const planets = [
    createPlanetState({
      id: PlanetId.parse("earth"),
      name: "earth",
    }),
    createPlanetState({
      id: PlanetId.parse("venus"),
      name: "venus",
    }),
    createPlanetState({
      id: PlanetId.parse("neptune"),
      name: "neptune",
    }),
  ];

  return {
    useAstronomicalObjectStore(astronomicalObjectId) {
      const astronomicalObjectState = planets.find(
        (state) => state.id === astronomicalObjectId
      );
      if (astronomicalObjectState == null) {
        throw new Error();
      }

      return composePlanetStore(astronomicalObjectState);
    },
  };
}
