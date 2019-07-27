import { gql } from "apollo-boost";

import { addItemToCart, getCartItemCount } from "./cart.utils";

// now we define the schema of querys and mutations we are going to use

// first type definition for the querys or mutations we add
export const typeDefs = gql`
  # type definitios where we are going to add any more values or types that we want the client to have access to
  extend type Mutation { # this just adds new mutations to the ones we have from the backend in case we had them, if there is none there is no prob
    ToggleCartHidden: Boolean! # we define that he mutation ToggleCartHidden always returns a boolean
    # this is capitalized because is a type definition
    # we need to add the new AddItemToCart method inside the mutations
    AddItemToCart(item: Item!): [Item]! # we define that this mutation will take an argument named item which is Item type always and it always returns an array of Items, that may be empty, thats why the ! is only outside the array
  }
  # our type Item in the backend does not have the quantity property, we have to extend it to add it
  extend type Item {
    quantity: Int # we dont add the ! because is not a mandatory value it might not exist
  }
`;

// first thing to do is to read from the cache the initial value
const GET_CART_HIDDEN = gql`
  {
    cartHidden @client # when we request something that is in the data root property we can do it directly without using query
    # @client is a keyword used to tell apollo to look for this in the local cache not in the backend
  }
`;

// we pull the cartItems from the client
const GET_CART_ITEMS = gql`
  {
    cartItems @client
  }
`;

const GET_ITEM_COUNT = gql`
  {
    itemCount @client
  }
`;

export const resolvers = {
  // we write a resolver object that is going to define what are mutations and what are queries as well as what additional types we might have in our client side cache that apollo has access to inside of this object
  Mutation: {
    // this is where we define our js mutations
    toggleCartHidden: (_root, _args, { cache }, _info) => {
      // _root object represents the top level object that holds the actual type | if it lives inside another type like item inside collection in our graphql background
      // in our case our mutation is in the top level of the cached object so it is not dependent of any other type
      // _args object represents all the arguments we could possible get access to inside of the mutation, that gets passed to it | for exmaple the $title of our GET_COLLECTION_BY_TITLE in the CollectionsPageContainer
      // _context the things that the apollo client has access to, which includes the cache and the client itself, we usually would just deconstruct the cache from it {cache}
      // _info has information about the query or the mutation
      const { cartHidden } = cache.readQuery({
        // we get the actual value of cartHidden from the data we are reading from the cache using the query defined previously
        query: GET_CART_HIDDEN
        // variables: {} // if we needed to pass variables we use the key variables and we pass an object
      });
      // now we want to update the value of our cache with our mutation
      cache.writeQuery({
        query: GET_CART_HIDDEN, // we say that we want to write in the same location
        data: { cartHidden: !cartHidden } // we state that the cartHidden property inside data get the reversed value it has
      });
      // finally we return the new value of cartHidden (reversed value) so that anyone calling the cartHidden resolver also gets back the new value of it if they want to do something with it
      return !cartHidden;
    },
    // we write the new mutation addItemToCart
    // from the _args we deconstruct item since we know it is a parameter of our mutation
    // from the _context we deconstruct the cache that is the only property we need from that object
    addItemToCart: (_root, { item }, { cache }) => {
      const { cartItems } = cache.readQuery({
        query: GET_CART_ITEMS
      });

      // we get the new cartItems using the utility funcitons we imported from cart.utils
      // the parameters of the functions will be the cartItems we had extracted from the client and the item passed as parameter of the mutation
      const newCartItems = addItemToCart(cartItems, item);

      // whenever the items gets added the count is updated
      cache.writeQuery({
        query: GET_ITEM_COUNT,
        data: { itemCount: getCartItemCount(newCartItems) }
      });

      // now we write the new values to the client
      cache.writeQuery({
        query: GET_CART_ITEMS,
        data: { cartItems: newCartItems }
      });
      return newCartItems;
    }
  }
};
