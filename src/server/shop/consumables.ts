/**
 * Items that are spent rather than owned.
 *
 * The rest of the shop is cosmetic and permanent, which is why UserInventory is
 * unique on (userId, itemId) — buying a frame twice is a mistake. A streak
 * freeze is the opposite: it is stock, so it lives as a counter on the user and
 * never gets an inventory row, otherwise the second purchase would 409.
 */
export const STREAK_FREEZE_ITEM_KEY = 'streak-freeze';

/** How many a student may hold at once, so freezes cannot be hoarded into immunity. */
export const MAX_STREAK_FREEZES = 3;

export function isConsumable(itemKey: string): boolean {
  return itemKey === STREAK_FREEZE_ITEM_KEY;
}
