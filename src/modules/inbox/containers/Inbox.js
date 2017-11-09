import React from 'react';
import PropTypes from 'prop-types';
import { compose, gql, graphql } from 'react-apollo';
import { Inbox as InboxComponent } from '../components';
import { queries } from '../graphql';

const Inbox = props => {
  const { conversationsQuery, currentConversationQuery, channelsQuery } = props;

  if (conversationsQuery.loading || currentConversationQuery.loading) {
    return false;
  }

  // =============== actions
  const changeStatus = () => {};

  const conversations = conversationsQuery.conversations;
  const channels = channelsQuery.channels || [];
  const currentConversation = currentConversationQuery.conversationsGetCurrent;

  const fields = channels.map(({ name, _id }) => ({
    _id: _id,
    title: name
  }));

  const updatedProps = {
    ...this.props,
    conversations,
    currentConversation,
    channels: fields,
    changeStatus
  };

  return <InboxComponent {...updatedProps} />;
};

Inbox.propTypes = {
  conversationsQuery: PropTypes.object,
  channelsQuery: PropTypes.object,
  currentConversationQuery: PropTypes.object
};

export default compose(
  graphql(gql(queries.channelList), {
    name: 'channelsQuery',
    options: ({ queryParams }) => {
      return {
        variables: { params: queryParams }
      };
    }
  }),
  graphql(gql(queries.conversationList), {
    name: 'conversationsQuery',
    options: ({ queryParams }) => {
      const params = { ...queryParams };
      delete params._id;

      return {
        variables: { params }
      };
    }
  }),
  graphql(gql(queries.currentConversation), {
    name: 'currentConversationQuery',
    options: ({ queryParams }) => {
      return {
        variables: { _id: queryParams._id }
      };
    }
  })
)(Inbox);
