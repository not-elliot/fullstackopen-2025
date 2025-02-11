import axios from "axios"

const baseUrl = 'http://localhost:3001/persons'

const getAll = () => axios.get(baseUrl).then(res => res.data)

const create = (newPerson) => axios.post(baseUrl, newPerson).then(res => res.data)

const update = (personId, updatedPerson) => axios.put(`${baseUrl}/${personId}`, updatedPerson).then(res => res.data)

const remove = (personId) => axios.delete(`${baseUrl}/${personId}`).then(res => res.data)

export default { getAll, create, update, remove }