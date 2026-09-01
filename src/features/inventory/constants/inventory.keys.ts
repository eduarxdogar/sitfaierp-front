export const INVENTORY_KEYS = {
  all: ['inventory'] as const,
  lists: () => [...INVENTORY_KEYS.all, 'list'] as const,
  list: (filters: string) => [...INVENTORY_KEYS.lists(), { filters }] as const,
  details: () => [...INVENTORY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...INVENTORY_KEYS.details(), id] as const,
  kardex: (id: string) => [...INVENTORY_KEYS.detail(id), 'kardex'] as const,
};
