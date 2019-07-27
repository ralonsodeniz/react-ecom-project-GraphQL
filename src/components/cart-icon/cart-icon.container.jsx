import React from "react";
import { Mutation, Query, compose, graphql } from "react-apollo"; // since qe are going to use the mutation for updating the value of cartHidden we need the Mutation component not the Query
import { gql } from "apollo-boost";

import CartIcon from "./cart-icon.component";

// we create our mutation query
const TOGGLE_CART_HIDDEN = gql`
  mutation ToggleCartHidden {
    # we call the mutation we have defined in our TypeDefs (remember to capitalize)
    toggleCartHidden @client # we pass through the toogleCartHidden mutation we wrote inside the resolver from our client | it is important because if we do not put the keyword @client it would go to look fro it to the backend
  }
`;

const GET_ITEM_COUNT = gql`
  {
    itemCount @client
  }
`;

export const CartIconContainerQueryMutation = () => (
  <Query query={GET_ITEM_COUNT}>
    {({ data: { itemCount } }) => (
      <Mutation mutation={TOGGLE_CART_HIDDEN}>
        {/* we are going to get from the object the mutation returns is the mutation we want to use */}
        {toggleCartHidden => (
          <CartIcon itemCount={itemCount} toggleCartHidden={toggleCartHidden} />
        )}
      </Mutation>
    )}
  </Query>
);

// <- compose and graphql functions replace Query and Mutation

export const CartIconContainer = ({
  data: { itemCount },
  toggleCartHidden
}) => {
  // now we get props from the composed component with the graphql objects

  return <CartIcon itemCount={itemCount} toggleCartHidden={toggleCartHidden} />;
};

export default compose(
  // compose ties the graphql with the component
  // graphql takes mutations and queries and binds them to some component
  graphql(GET_ITEM_COUNT), // keep in mind that the itemCount is going to be inside data object
  graphql(TOGGLE_CART_HIDDEN, { name: "toggleCartHidden" }) // the mutations returned by graphql are returned wit ha different name so we pass a configuration object to solve this
)(CartIconContainer);
