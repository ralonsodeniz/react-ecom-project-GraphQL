import React from "react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";

import CollectionItem from "./collection-item.component";

const ADD_ITEM_TO_CART = gql`
  mutation AddItemToCart($item: Item!) {
    # we make the type definition of the mutation and set that it has one parameter $item with type Item that is mandatory
    addItemToCart(item: $item) @client # we declare the mutation with its parameter and that it has to be taken from the local client
  }
`;

// here we are going to need access to the props passed to the CollectionItem because we need the item for our mutation
const CollectionItemContainer = props => (
  <Mutation mutation={ADD_ITEM_TO_CART}>
    {addItemToCart => (
      <CollectionItem
        {...props} // we pass the props the container gets down to the component itslef
        addItem={item => addItemToCart({ variables: { item } })} // we get the item prop and we use it as a variable of our mutation passing it as an object with the variable key
        // we could have done this the same way we did in the collection container also, this is a shorthand way
      />
    )}
  </Mutation>
);

export default CollectionItemContainer;
