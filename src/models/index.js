// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const PostStatus = {
  "ACTIVE": "ACTIVE",
  "INACTIVE": "INACTIVE"
};

const { User, Post, Todo } = initSchema(schema);

export {
  User,
  Post,
  Todo,
  PostStatus
};