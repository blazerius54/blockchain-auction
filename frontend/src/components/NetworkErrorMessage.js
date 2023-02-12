const NetworkErrorMessage = ({ message, dismiss }) => (
    <div>
        {message}
        <button type="button" onClick={dismiss}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
)

export default NetworkErrorMessage