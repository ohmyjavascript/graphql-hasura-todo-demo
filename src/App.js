import './App.css';
import { useQuery, useMutation } from '@apollo/client';
import { useState } from 'react';
import { ADD_TODO, DELETE_TODO, GET_TODOS, TOGGLE_TODO } from './queries';

function App() {
  const { loading, error, data } = useQuery(GET_TODOS);
  const [toggleTodo] = useMutation(TOGGLE_TODO);
  const [addTodo] = useMutation(ADD_TODO, {
    onCompleted: () => {
      console.log('completed...');
      setTask('');
    },
  });
  const [deleteTodo] = useMutation(DELETE_TODO);
  const [task, setTask] = useState('');

  const handleAdd = async (event) => {
    event.preventDefault();
    if (!task.length) {
      return;
    }

    await addTodo({
      variables: {
        text: task,
        done: false,
      },
      refetchQueries: [{ query: GET_TODOS }], // we make an HTTP req for every refetching query
    });
  };

  const handleDeleteTodo = async (id) => {
    await deleteTodo({
      variables: {
        id: id,
      },
      update: (cache) => {
        // we manually update the cache
        const prevData = cache.readQuery({ query: GET_TODOS });
        const newTodos = prevData.todos.filter((t) => t.id !== id);
        cache.writeQuery({
          query: GET_TODOS,
          data: {
            todos: newTodos,
          },
        });
      },
    });
  };

  const handleTodo = async (todo) => {
    await toggleTodo({
      variables: {
        id: todo.id,
        done: !todo.done,
      },
    });
  };
  if (loading) {
    return <p> Loading..</p>;
  }
  if (error) {
    return <p> Error..</p>;
  }
  return (
    <div className="bg-slate-100 h-screen">
      <div
        className="bg-gray-50 rounded-lg py-5 px-6 mb-4 text-base text-gray-500 mb-3"
        role="alert"
      >
        <h2 className="font-medium text-center leading-tight text-2xl mt-0 mb-2 text-gray-600">
          GraphQL / Hasura / Apollo Example
        </h2>
      </div>
      <div
        className="bg-indigo-100 rounded-lg py-5 px-6 mb-4 text-base text-indigo-700 mb-3 max-w-sm ml-auto mr-auto"
        role="alert"
      >
        Add New Checklist
      </div>
      <div className="block p-6 rounded-lg shadow-lg bg-white max-w-sm ml-auto mr-auto mb-16 mt-8">
        <form onSubmit={handleAdd}>
          <div className="form-group mb-6">
            <label
              htmlFor="exampleInputEmail1"
              className="form-label inline-block mb-2 text-gray-700"
            >
              Add New Task
            </label>
            <input
              type="text"
              className="form-control block w-full px-3 py-1.5 text-base font-normal
              text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300
              rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white 
              focus:border-blue-600 focus:outline-none"
              placeholder="Enter Task"
              onChange={(e) => setTask(e.target.value)}
              value={task}
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 text-white font-medium text-xs
            leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg
            focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
            active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          >
            ADD
          </button>
        </form>
      </div>

      <div
        className="bg-indigo-100 rounded-lg py-5 px-6 mb-4 text-base text-indigo-700 mb-3 max-w-sm ml-auto mr-auto"
        role="alert"
      >
        Current Checklist ( Double click to strike out)
      </div>

      <div className="flex justify-center">
        <ul className="bg-white rounded-lg border border-gray-200 w-96 text-gray-900">
          {data.todos.map((todo) => {
            return (
              <li
                className="px-6 py-2 border-b border-gray-200 w-full rounded-t-lg flex justify-between"
                key={todo.id}
              >
                <span
                  onDoubleClick={() => handleTodo(todo)}
                  className={todo.done ? 'line-through' : 'capitalize'}
                >
                  {todo.text}
                </span>
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="inline-block px-4 py-1.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                >
                  x
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
