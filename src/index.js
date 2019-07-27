import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ApolloProvider } from "react-apollo"; // this is similar to the redux and contextAPI provider, it allows to the rest of the appolication to access the state stored on Apollo
import { createHttpLink } from "apollo-link-http"; // this is what is going to allow us to connect our client to our specific graphql endopoint (/graphql)
import { InMemoryCache } from "apollo-cache-inmemory"; // this is what apollo uses to cache the data to avoid unnecesary requests to fetch the backend
import { ApolloClient } from "apollo-boost"; // apollo boost is a bundle of smaller libraries created by the apollo team
// import { gql } from "apollo-boost";
// gql is a function from apollo boost to make requests
import { resolvers, typeDefs } from "./graphql/resolvers";

import { store, persistor } from "./redux/store";

import "./index.css";
import App from "./App";

// we frist stablish our connection to the backend
const httpLink = createHttpLink({
  uri: "https://crwn-clothing.com" // this is the url to the backend endpoint
});

// we create our cache
const cache = new InMemoryCache(); // the InMmoryCache is a class. Is similar to a top level reducer like the object we used as local storage fro our application

// we create the apollo client
const client = new ApolloClient({
  link: httpLink, // we pass as an object both the link where to make the requests and the cache object where to store them
  cache,
  typeDefs,
  resolvers
});

// we create the initial state for our local storage inside apollo cache
client.writeData({
  data: {
    // we use data as parent property since all the queries we do to the graphql endpoint returns an object which parent data key is data
    cartHidden: true,
    cartItems: [],
    itemCount: 0
  }
});

// we create a test query using query method from client object and we pass an object with the property query that has the value of a gql function that uses `` and where we pass the actual query as in the playground
// the query returns a promise that resolves to the date if the fetch is successful
// client
//   .query({
//     query: gql`
//       {
//         getCollectionsByTitle(title: "hats") {
//           title
//           items {
//             name
//             price
//           }
//         }
//       }
//     `
//   })
//   .then(response => console.log(response));

ReactDOM.render(
  // the apollo provider will give access to the application to the apollo client and to make requests to our backend
  <ApolloProvider client={client}>
    <Provider store={store}>
      <BrowserRouter>
        <PersistGate persistor={persistor}>
          <App />
        </PersistGate>
      </BrowserRouter>
    </Provider>
  </ApolloProvider>,
  document.getElementById("root")
);
