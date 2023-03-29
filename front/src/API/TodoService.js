import axios from "axios"

export default class TodoService {

    static async getTodo(token, userId) {
        const response = await axios.get('/api/todo', {
            params: { userId },
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        return response.data
    }

    static async createTodo(token, userId, task) {
        const response = await axios.post('/api/todo/add', { task, userId }, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        return response.data
    }

    static async removeTodo(token, id) {
        const response = await axios.delete(`/api/todo/delete/${id}`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        return response.data
    }

    static async completeTodo(token, id) {
        const response = await axios.put(`/api/todo/complete/${id}`, { id }, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        return response.data
    }

    static async importantTodo(token, id) {
        const response = await axios.put(`/api/todo/important/${id}`, { id }, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        return response.data
    }
}