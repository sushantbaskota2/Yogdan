import { TOGGLE_HAM_VIS } from "../type";

export const setHamBurger = (value, user) => {
  return {
    type: TOGGLE_HAM_VIS,
    payload: value,
  };
};
