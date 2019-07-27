import React from "react";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";

import Header from "./header.component";

// we add the query for our query component, is the same as we have in the resolver, in the end we are just querying the value we have in the local storage
const GET_CART_HIDDEN = gql`
  {
    cartHidden @client
  }
`;

const HeaderContainer = () => (
  <Query query={GET_CART_HIDDEN}>
    {// from the data we only want the cartHidden
    ({ data: { cartHidden } }) => <Header hidden={cartHidden} />}
  </Query>
);

export default HeaderContainer;
