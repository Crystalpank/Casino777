import React, { useState } from 'react';
import { useCallback } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../App';
import { useEffect } from 'react';
import { useFetching } from '../hooks/fetch.hook';
import TodoService from '../API/TodoService';
import AddTodoForm from '../components/Form/AddTodoForm';
import TodoList from '../components/Todo/TodoList';
import { Preloader } from 'react-materialize';

const Todo = () => {

    const { userId, token, logout } = useContext(AuthContext)
    const [todos, setTodos] = useState([])

    const [getTodoFetching, isLoadingGetTodo, errorGetTodo] = useFetching(async () => {
        const response = await TodoService.getTodo(token, userId)
        setTodos(response)
    })



    useEffect(() => {
        getTodoFetching()
        if (errorGetTodo) {
            logout()
        }
    }, [errorGetTodo, logout])

    const createTodo = useCallback(async (newTodo) => {
        setTodos([...todos, newTodo])
        await TodoService.createTodo(token, userId, newTodo)
    }, [todos, token, userId])

    const removeTodo = useCallback(async (id) => {
        try {
            setTodos(todos.filter(t => t.id !== id))
            await TodoService.removeTodo(token, id)
        } catch (e) {
            console.log(e)
        }
    }, [token, todos])

    const completeTodo = useCallback(async (todo) => {
        try {
            todo.completed = !todo.completed
            let copy = Object.assign([], todos)
            setTodos(copy)
            await TodoService.completeTodo(token, todo.id)
            // getTodoFetching()
        } catch (e) {
            console.log(e)
        }
    }, [token, todos])

    const importantTodo = useCallback(async (todo) => {
        try {
            todo.important = !todo.important
            let copy = Object.assign([], todos)
            setTodos(copy)
            await TodoService.importantTodo(token, todo.id)
        } catch (e) {
            console.log(e)
        }
    }, [token, todos])


    return (
        <div className="container">
            <div className="main-page">
                <AddTodoForm create={createTodo} />
                {
                    isLoadingGetTodo ?
                    <Preloader /> :
                    <TodoList todos={todos} completeTodo={completeTodo} importantTodo={importantTodo} removeTodo={removeTodo} />
                }
                
            </div>

        </div>
    );
}

export default Todo;
