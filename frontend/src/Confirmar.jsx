import Modal from './Modal.jsx'

export default function Confirmar({ titulo, texto, textoBoton, onCerrar, onConfirmar }) {
  return (
    <Modal titulo={titulo} onCerrar={onCerrar}>
      <p className="modal-sub">{texto}</p>
      <div className="form-acciones">
        <button className="btn btn-borde" onClick={onCerrar}>Cancelar</button>
        <button className="btn btn-peligro" onClick={onConfirmar}>{textoBoton}</button>
      </div>
    </Modal>
  )
}
