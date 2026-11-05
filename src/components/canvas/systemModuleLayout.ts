export const MODULE_POSITIONS = {
  core: { x: 50, y: 47 },
  frontend: { x: 23, y: 22 },
  backend: { x: 77, y: 22 },
  infra: { x: 23, y: 76 },
  data: { x: 77, y: 76 },
} as const;

export type SystemModuleId = keyof typeof MODULE_POSITIONS;

export const MODULE_LIGHTS = {
  core: '#66eaff',
  frontend: '#00f5d4',
  backend: '#ffb44d',
  infra: '#ff9e36',
  data: '#a193ff',
} satisfies Record<SystemModuleId, string>;

export const BOARD_WIDTH = 1000;
export const BOARD_HEIGHT = 750;
