import { gql } from '@apollo/client';

export const GET_TODOS = gql`
  query getTodos {
    todos {
      done
      id
      text
    }
  }
`;

export const TOGGLE_TODO = gql`
  mutation MyMutation($id: uuid!, $done: Boolean!) {
    update_todos(where: { id: { _eq: $id } }, _set: { done: $done }) {
      returning {
        id
        text
        done
      }
    }
  }
`;

export const ADD_TODO = gql`
  mutation addTodo($text: String!) {
    insert_todos_one(object: { text: $text, done: false }) {
      done
      id
      text
    }
  }
`;

export const DELETE_TODO = gql`
  mutation deleteTodo($id: uuid!) {
    delete_todos_by_pk(id: $id) {
      done
      id
      text
    }
  }
`;
