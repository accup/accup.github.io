import { shallowReactive } from "vue";

import type { PlanetId } from "../planet_ids/PlanetId.value";

export type PlanetState = {
  readonly id: PlanetId;
  name: string;
};

export type CreatePlanetStateProps = {
  readonly id: PlanetId;
  readonly name: string;
};

export function createPlanetState({
  id,
  name,
}: CreatePlanetStateProps): PlanetState {
  return shallowReactive({
    id,
    name,
  });
}
