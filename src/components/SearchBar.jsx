import styled from 'styled-components'
import { FaSearch } from 'react-icons/fa'

const Wrapper = styled.div`
  position: relative;
  max-width: 480px;
  margin: 0 0 1.75rem;

  svg {
    position: absolute;
    top: 50%;
    left: 0.9rem;
    transform: translateY(-50%);
    color: var(--color-muted);
    pointer-events: none;
  }

  input {
    width: 100%;
    padding: 0.7rem 1rem 0.7rem 2.5rem;
    border-radius: 999px;
    border: 1px solid var(--color-surface-2);
    background: var(--color-surface);
    color: var(--color-text);
    font-size: 0.95rem;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }

  input::placeholder {
    color: var(--color-muted);
  }

  input:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
  }
`

function SearchBar({ value, onChange, placeholder = 'Buscar productos…' }) {
  return (
    <Wrapper>
      <FaSearch aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Buscar productos"
      />
    </Wrapper>
  )
}

export default SearchBar
