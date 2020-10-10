import { TOGGLE_HAM_VIS } from "../type";
const initialState = {
  hamBurgerIsVisible: false,
};

const setHamBurger = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case TOGGLE_HAM_VIS:
      return { hamBurgerIsVisible: payload };

    default:
      return state;
  }
};

export default setHamBurger;
