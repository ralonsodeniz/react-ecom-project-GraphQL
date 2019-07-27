import React from "react";
import { Query, Mutation } from "react-apollo";
import { gql } from "apollo-boost";

import CartDropdown from "./cart-dropdown.component";

const TOGGLE_CART_HIDDEN = gql`
  mutation ToggleCartHidden {
    toggleCartHidden @client
  }
`;

const GET_CART_ITEMS = gql`
  {
    cartItems @client
  }
`;

// in this case we have to use both the mutation and the query, we have to nest one inside the function the other returns
const CartDropdownContainer = () => (
  <Mutation mutation={TOGGLE_CART_HIDDEN}>
    {toggleCartHidden => (
      <Query query={GET_CART_ITEMS}>
        {(
          { data: { cartItems } } // remember the query returns an object that inside of it we have the data key that containes the data we need
        ) => (
          <CartDropdown
            // CartDropdown has access to toggleCartHidden since it is in its parent scope
            toggleCartHidden={toggleCartHidden}
            cartItems={cartItems}
          />
        )}
      </Query>
    )}
  </Mutation>
);

export default CartDropdownContainer;
