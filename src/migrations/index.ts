import * as migration_20250515_113302 from "./20250515_113302";
import * as migration_20250624_150241 from "./20250624_150241";

export const migrations = [
  {
    up: migration_20250515_113302.up,
    down: migration_20250515_113302.down,
    name: "20250515_113302",
  },
  {
    up: migration_20250624_150241.up,
    down: migration_20250624_150241.down,
    name: "20250624_150241",
  },
];
