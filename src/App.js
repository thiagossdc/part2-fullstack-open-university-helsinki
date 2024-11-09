import React, { useState, useEffect } from 'react';
import personService from './services/persons'; 

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [message, setMessage] = useState(null); 
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    personService
      .getAll()
      .then((response) => {
        setPersons(response.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar os dados:', error);
      });
  }, []);

  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);
  const handleFilterChange = (event) => setFilter(event.target.value);

  const handleSubmit = (event) => {
    event.preventDefault();

    const personExists = persons.some((person) => person.name === newName);

    if (personExists) {
      const person = persons.find((person) => person.name === newName);
      const confirmUpdate = window.confirm(
        `${newName} is already in the phonebook. Do you want to update the number?`
      );

      if (confirmUpdate) {
        const updatedPerson = { ...person, number: newNumber };

        personService
        .update(person.id, updatedPerson)
        .then((response) => {
          setPersons(persons.map((p) => (p.id === person.id ? response.data : p)));
          setNewName('');
          setNewNumber('');
          showMessage(`Successfully updated the number for ${newName}`, 'success');
        })
        .catch((error) => {
          showMessage(`Information of ${newName} has already been removed from the server`, 'error');
          console.error('Erro ao atualizar o número:', error);
        });      
      }
    } else {
      const newPerson = { name: newName, number: newNumber };

      personService
        .create(newPerson)
        .then((response) => {
          setPersons(persons.concat(response.data));
          setNewName('');
          setNewNumber('');
          showMessage(`Successfully added ${newName}`, 'success');
        })
        .catch((error) => {
          console.error('Erro ao adicionar o contato:', error);
          showMessage('Failed to add person. Try again later.', 'error');
        });
    }
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this contact?');

    if (confirmDelete) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          showMessage('Contact deleted successfully', 'success');
        })
        .catch((error) => {
          showMessage('Failed to delete contact. Try again later.', 'error');
          console.error('Erro ao excluir o contato:', error);
        });
    }
  };

  const showMessage = (message, type) => {
    setMessage(message);
    setMessageType(type);
    setTimeout(() => {
      setMessage(null);
      setMessageType('');
    }, 5000); 
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>

      {message && (
        <div className={`notification ${messageType}`}>
          {message}
        </div>
      )}

      <div>
        filter shown with: <input value={filter} onChange={handleFilterChange} />
      </div>

      <h3>Add a new</h3>

      <form onSubmit={handleSubmit}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h3>Numbers</h3>

      <ul>
        {filteredPersons.map((person) => (
          <li key={person.id}>
            {person.name} {person.number}{' '}
            <button onClick={() => handleDelete(person.id)}>delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
