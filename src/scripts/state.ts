// Tiny shared state for the two property pickers.
import type { PropertyType } from '../lib/plans';

export const state = { type: 'building' as PropertyType, isoRevealed: false };
export const setIsoRevealed = (v: boolean) => { state.isoRevealed = v; };
