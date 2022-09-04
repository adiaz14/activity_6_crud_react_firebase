import React, { useState } from 'react'
import { firebase } from '../Firebase/firebase.js'

const Crud = () => {

    //Hooks
    const [name, setname] = useState('')
    const [lastname, setlastname] = useState('')
    const [id, setId] = useState('')
    const [list, setlist] = useState([])
    const [error, setError] = useState(null)
    const [editionMode, setEditionMode] = useState(false)
    //Use effects
    React.useEffect(() => {
        const getData = async () => {
            try {
                const db = firebase.firestore()
                const data = await db.collection('crud_fire_6').get()
                const arrayData = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
                setlist(arrayData)
            } catch (error) {
                console.log(error)
            }
        }
        getData()
    }, [])

    //Save user data
    const saveData = async (e) => {
        //Prevent default behavior of the browser
        e.preventDefault()
        //Validations
        if (!name.trim()) {
            setError('Please insert name')
            return
        }
        if (!lastname.trim()) {
            setError('Please insert lastname')
            return
        }
        //Store user data in Firebase/firestore
        try {
            const db = firebase.firestore()
            const newUser = {
                name, lastname
            }
            const dato = await db.collection('crud_fire_6').add(newUser)
            setlist([
                ...list,
                { ...newUser, id: dato.id }
            ])
        } catch (error) {
            console.log(error)
        }
        //Clear inputs
        e.target.reset()
        //Clear states
        setname('')
        setlastname('')
        //Clear error
        setError(null)
        //Set focus in the input text element "name" to continue saving new users
        document.getElementById("name").focus();
    }
    //Delete user
    const deleteUser = async (id) => {
        //Validations
        if (editionMode) {
            setError('Please finish the edition.')
            return
        }
        //delete in firebase
        try {
            const db = firebase.firestore()
            await db.collection('crud_fire_6').doc(id).delete()
            const listFiltrada = list.filter((element) => element.id !== id)
            setlist(listFiltrada)
        } catch (error) {
            console.log(error)
        }

    }
    //Edit - prepare to edit user (Enable edition mode)
    const editMode = (element) => {
        setEditionMode(true)
        setname(element.name)
        setlastname(element.lastname)
        setId(element.id)
    }
    //Edit user
    const editData = async (e) => {
        //Prevent default behavior of the browser
        e.preventDefault()
        //validations
        if (!name.trim()) {
            setError('Imput name')
            return
        }
        if (!lastname.trim()) {
            setError('Input lastname')
            return
        }
        //Edit in firebase
        try {
            const db = firebase.firestore()
            await db.collection('crud_fire_6').doc(id).update({
                name, lastname
            })
        } catch (error) {
            console.log(error)
        }
        const editedList = list.map(
            (element) => element.id === id ?
                { id: id, name: name, lastname: lastname } :
                element)
        //New list
        setlist(editedList)
        //Disable edition mode
        setEditionMode(false)
        //Clear inputs
        e.target.reset()
        //Clear states
        setname('')
        setlastname('')
        setId('')
        //Clear error
        setError(null)
        //Set focus in the input text element "name" to continue saving new users
        document.getElementById("name").focus();
    }
    return (
        <div className="container-page container">
            <div className="row">
                <div className="col-12">
                    <h4 className="text-center">
                        {
                            editionMode ? 'EDITION MODE: EDIT AN USER' : 'REGISTER NEW USERS'
                        }
                    </h4>
                    <form onSubmit={editionMode ? editData : saveData}>
                        {
                            error ? (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            ) : null
                        }
                        <input type="text"
                            placeholder="Ingrese name"
                            className="form-control mb-3"
                            id="name"
                            onChange={(e) => {
                                setname(e.target.value)
                                if (error === 'Input name' || error === 'Please finish the edition.') {
                                    setError(null)
                                }
                            }}
                            value={name}
                        />
                        <input type="text"
                            placeholder="Ingrese lastname"
                            className="form-control mb-3"
                            onChange={(e) => {
                                setlastname(e.target.value)
                                if (error === 'Input lastname' || error === 'Please finish the edition.') {
                                    setError(null)
                                }
                            }}
                            value={lastname}
                        />
                        <div className="d-grid gap-2">
                            {
                                editionMode ? (<button className="btn btn-warning" type="submit">Editar</button>)
                                    : (<button className="btn btn-primary" type="submit">Registrar</button>)
                            }

                        </div>

                    </form>
                </div>
            </div>
            <hr />
            <div className="row">
                <div className="col-12">
                    <h4 className="text-center">LIST OF REGISTERED USERS</h4>
                    <ul className="list-group">
                        {
                            list.map((element) => (
                                <li key={element.id} className="list-group-item">
                                    {element.name} {element.lastname}
                                    <button className="btn btn-danger float-end mx-2"
                                        onClick={() => deleteUser(element.id)}>Delete</button>
                                    <button className="btn btn-success float-end mx-2"
                                        onClick={() => editMode(element)}>Edit</button>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Crud