import axios from 'axios'
const baseUrl = 'https://findit3.azurewebsites.net/consultants'

const getOne = (id) => {
    const request = axios.get(`${baseUrl}/${id}`)
    return request.then(response => response.data)
  }

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
  }

const getRand = (amount) => {
    const request = axios.get(`${baseUrl}/rand/${amount}`)
    return request.then(response => response.data)
  }
  
const create = async newObject => {
	const response = await axios.post(baseUrl, newObject)
	return response.data
}

const remove = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.data)
}

const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
}
// eslint-disable-next-line import/no-anonymous-default-export
export default { getOne, getAll, create, remove, update, getRand }