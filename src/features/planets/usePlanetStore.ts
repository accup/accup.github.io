import type { PlanetId } from "../planet_ids/PlanetId.value";

import { useSpaceStore } from "../spaces/useSpaceStore";

import type { PlanetState } from "./createPlanetState";

export type PlanetStore = {
  readonly setName: (this: void, name: string) => void;
};

export type UsePlanetStoreProps = {
  id: PlanetId;
};

export function useAstronomicalObjectStore({
  id,
}: UsePlanetStoreProps): PlanetStore {
  const spaceStore = useSpaceStore();
  return spaceStore.useAstronomicalObjectStore(id);
}

export function composePlanetStore(state: PlanetState): PlanetStore {
  return {
    setName(name) {
      state.name = name;
    },
  };
}
