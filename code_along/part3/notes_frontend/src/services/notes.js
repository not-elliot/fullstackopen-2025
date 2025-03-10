import axios from 'axios'

// const baseUrl = 'http://localhost:3001/api/notes'
const baseUrl = '/api/notes'


const getAll = () => {
    const nonExisting = {
        id: 10000,
        content: 'This note is not saved to server',
        important: true,
    }
    return axios.get(baseUrl).then(res => res.data.concat(nonExisting))
}

const create = (newObject) => {
    return axios.post(baseUrl, newObject).then(res => res.data)
}

const update = (id, newObject) => {
    return axios.put(`${baseUrl}/${id}`, newObject).then(res => res.data)
}

export default { getAll, create, update }