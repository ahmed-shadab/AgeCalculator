import { useState } from 'react'
import './App.css'

function App() {
  const [birthdate, setBirthdate] = useState('')
  const [result, setResult] = useState('')
  const [isError, setIsError] = useState(false)

  const calculateAge = () => {
    if (!birthdate) {
      setResult('Please enter a date.')
      setIsError(true)
      return
    }

    // Ensure the date strictly matches DD-MM-YYYY
    const datePattern = /^(\d{2})-(\d{2})-(\d{4})$/
    if (!datePattern.test(birthdate)) {
      setResult('Please enter a valid date in DD-MM-YYYY format.')
      setIsError(true)
      return
    }

    const [day, month, year] = birthdate.split('-')
    const birth = new Date(`${year}-${month}-${day}T00:00:00`)
    
    // Check if the date is a real calendar date (e.g., prevents 31-02-2023)
    if (isNaN(birth.getTime()) || birth.getDate() !== parseInt(day, 10)) {
      setResult('Please enter a valid calendar date.')
      setIsError(true)
      return
    }

    const today = new Date()

    if (birth > today) {
      setResult('Birth date cannot be in the future.')
      setIsError(true)
      return
    }

    let years = today.getFullYear() - birth.getFullYear()
    let months = today.getMonth() - birth.getMonth()

    if (today.getDate() < birth.getDate()) {
      months--
    }

    if (months < 0) {
      years--
      months += 12
    }

    setResult(`You are ${years} years and ${months} months old.`)
    setIsError(false)
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    // Check if the user is backspacing so we don't accidentally auto-format over their deletes
    const isDeleting = val.length < birthdate.length
    
    let newVal = val
    // Auto-pad single digit if user manually types a hyphen (e.g., '1-' -> '01-')
    newVal = newVal.replace(/^(\d)-/, '0$1-')
    newVal = newVal.replace(/^(\d{2})-(\d)-/, '$1-0$2-')

    // Remove all non-number characters
    let digits = newVal.replace(/\D/g, '')

    // Smart padding for day and month without needing to type a hyphen
    if (!isDeleting) {
      if (digits.length === 1 && parseInt(digits[0]) > 3) {
        digits = '0' + digits
      }
      if (digits.length === 3 && parseInt(digits[2]) > 1) {
        digits = digits.substring(0, 2) + '0' + digits.substring(2)
      }
    }

    // Automatically insert dashes for the DD-MM-YYYY format
    let formatted = digits
    if (digits.length > 4) {
      formatted = digits.substring(0, 2) + '-' + digits.substring(2, 4) + '-' + digits.substring(4, 8)
    } else if (digits.length > 2) {
      formatted = digits.substring(0, 2) + '-' + digits.substring(2)
    }

    // Automatically add a trailing hyphen if a block is finished
    if (!isDeleting && (formatted.length === 2 || formatted.length === 5)) {
      formatted += '-'
    }
    
    setBirthdate(formatted)
  }

  return (
    <div className="calculator-container">
      <h1>Age Calculator</h1>
      <p>Enter your date of birth to find out your exact age.</p>
      
      <div className="input-group">
        <input 
          type="text" 
          value={birthdate}
          placeholder="DD-MM-YYYY"
          maxLength={10}
          onChange={handleDateChange} 
        />
      </div>
      
      <button onClick={calculateAge}>Calculate Age</button>
      
      <div className={`result ${isError ? 'error' : ''}`}>
        {result}
      </div>

      <div className="footer">
        Made by Shadab Ahmed
      </div>
    </div>
  )
}

export default App
