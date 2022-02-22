import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { 
  fetchThunk, 
  setFilter, 
  setComplete, 
  selectStatus, 
  selectTodos 
} from './features/todos'

const TodoItem = ({ todo }) => {
  const dispatch = useDispatch()
  
  return(
    <li
      style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
      onClick={() => dispatch(setComplete(todo))}
    >
      {todo.title}
    </li>
  )
}

const App = () => {
  const [value, setValue] = useState('')
  const dispatch = useDispatch()
  const todos = useSelector(selectTodos)
  const status = useSelector(selectStatus)
  const submit = e => {
    e.preventDefault()
    if (!value.trim()) {
      return
    }
    const id = Math.random().toString(36)
    const todo = { title: value, completed: false, id }
    dispatch({ type: 'todo/add', payload: todo })
    setValue('')
  }

  if (status.loading === 'pending') {
    return <h1>Cargando...</h1>
  }
  
  if (status.loading === 'rejected') {
    return <p>{status.error}</p>
  }

  return (
    <div>
      <form onSubmit={submit}>
        <input value={value} onChange={e => setValue(e.target.value)} />
      </form>
      <button onClick={() => dispatch(setFilter('all'))}>Mostrar todos</button>
      <button onClick={() => dispatch(setFilter('complete'))}>Completados</button>
      <button onClick={() => dispatch(setFilter('incomplete'))}>Incompletos</button>
      <button onClick={() => dispatch(fetchThunk())}>Fetch</button>
      <ul>
        {todos.map(todo => <TodoItem key={todo.id} todo={todo} />)}
      </ul>
    </div>
  )
}

export default App

// nunca realizar mutabilidad dentro de los reducers
// export const reducer = (state = initialState, action) => {
//   switch (action.type) {
//     case 'todo/add': {
//       return {
//         ...state, // siempre devolver una nueva copia del estado para que pueda ser renderizado el componente app
//         entities: state.entities.concat({ ...action.payload })
//       }
//     }
//     case 'todo/complete': {
//       const newTodos = state.entities.map(todo => {
//         if (todo.id === action.payload.id) {
//           return { ...todo, completed: !todo.completed }
//         }
//         return todo
//       })
//       return {
//         ...state,
//         entities: newTodos
//       }
//     }
//     case 'filter/set':
//       return {
//         ...state,
//         filter: action.payload
//       }
//    default:
//      return state   
//   }
//   // return state
// }