import { z } from "zod";

declare const PlanetBrand: unique symbol;

export const PlanetId = z.string().brand(PlanetBrand);

export type PlanetId = z.infer<typeof PlanetId>;
