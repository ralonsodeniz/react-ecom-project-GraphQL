import React from "react";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";

import CollectionPage from "./collection.component";
import Spinner from "../../components/spinner/spinner.component";

// now we need to get an spefic collection not all collections using the query getCollectionsByTitle that the graphql endpoint gives us
const GET_COLLECTION_BY_TITLE = gql`
  query getCollectionsByTitle($title: String!) {
    # in this case as we are going to use a query that uses a selector (parameters) we have to define what query and type of the selector we are using
    getCollectionsByTitle(title: $title) {
      #this is now expecting a $title variable for the query that we are going to pass to the sentence once we call the Query component in our container component
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

const CollectionPageContainer = ({ match }) => {
  return (
    <Query
      query={GET_COLLECTION_BY_TITLE}
      variables={{ title: match.params.collectionId }}
    >
      {/* with the variables key we pass an object with the value of the variables we need for our queries*/}
      {/* since we know that the data comes in an object called data and inside of it in a property with the key of the query we get what we want, the value of the data.getCollectionsByTitle which is an object with the info of the selected collection */}
      {({ loading, data: { getCollectionsByTitle } }) =>
        loading ? (
          <Spinner />
        ) : (
          <CollectionPage collection={getCollectionsByTitle} />
        )
      }
    </Query>
  );
};

export default CollectionPageContainer;
