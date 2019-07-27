// this is going to be the graphql container
import React from "react";
import { Query } from "react-apollo"; // the query component is what we are going to use instead of client.query()
// Query is going to receive the graphql query we want to make and it is going to fetch that data and give it back to us as a function
import { gql } from "apollo-boost";

import CollectionOverview from "./collections-overview.component";
import Spinner from "../spinner/spinner.component";

// we write the request (capitalized and using underscore since it is going to be a constant)
const GET_COLLECCTIONS = gql`
  query collections {
    # when we do not have to pass parameters we could have just skipped this first line
    collections {
      id
      title
      items {
        id
        name
        price
        imageUrl
      }
    }
  }
`;

// now we create our new functional component
const CollectionOverviewContainer = () => (
  <Query query={GET_COLLECCTIONS}>
    {/* // remember Query gives back a function like when we used context api .Consumer instead of useContext
    // on that function is going to be an object that holds a lot of different properies that are pass in but we deconstruct the main ones we are interested in */}
    {({ loading, error, data }) => {
      if (loading) return <Spinner />;
      // if loading is false we dont return and execute next code
      return <CollectionOverview collections={data.collections} />;
    }}
  </Query>
);

export default CollectionOverviewContainer;

// we have created a container component for CollectionsOverview that wraps it with two functionalities, it makes the api call to the grapql endpoint using the query so we can access the backend data and also adds conditional render of the spinner while the fetching is being processed
// data is the parent object graphql returns, we have to keep this in mind when we access the data we want so we access the desired property inside data
