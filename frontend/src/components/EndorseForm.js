import React, { useState } from 'react';
import './EndorseForm.css';

const initialFormData = {
  policyNumber: '08200000049',
  idEnvio: 5984,
  frecuencia: 'Semestral',
  tipoEndoso: 'CambioFrecuencia',
  producto: 'Rumbo',
  plan: 'PlanRumbo',
  moneda: 'Nuevo Sol',
  usuario: 'interface.servicios',
  fechaSolicitud: '2025-08-27',
  fechaCliente: '2025-08-27',
  fechaEfectiva: '2025-09-01',
};

function EndorseForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'idEnvio' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleReset = () => {
    setFormData(initialFormData);
  };

  return (
    <form onSubmit={handleSubmit} className="endorse-form">
      <div className="form-row">
        <div className="form-field">
          <label>
            Número de Póliza <span className="required">*</span>
          </label>
          <input
            type="text"
            name="policyNumber"
            value={formData.policyNumber}
            onChange={handleChange}
            required
            placeholder="08200000049"
          />
        </div>

        <div className="form-field">
          <label>
            ID Envío <span className="required">*</span>
          </label>
          <input
            type="number"
            name="idEnvio"
            value={formData.idEnvio}
            onChange={handleChange}
            required
            placeholder="5984"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label>
            Tipo de Endoso <span className="required">*</span>
          </label>
          <input
            type="text"
            name="tipoEndoso"
            value={formData.tipoEndoso}
            onChange={handleChange}
            required
            placeholder="CambioFrecuencia"
          />
        </div>

        <div className="form-field">
          <label>
            Producto <span className="required">*</span>
          </label>
          <input
            type="text"
            name="producto"
            value={formData.producto}
            onChange={handleChange}
            required
            placeholder="Rumbo"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label>Frecuencia</label>
          <input
            type="text"
            name="frecuencia"
            value={formData.frecuencia}
            onChange={handleChange}
            placeholder="Semestral"
          />
        </div>

        <div className="form-field">
          <label>Plan</label>
          <input
            type="text"
            name="plan"
            value={formData.plan}
            onChange={handleChange}
            placeholder="PlanRumbo"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label>Moneda</label>
          <input
            type="text"
            name="moneda"
            value={formData.moneda}
            onChange={handleChange}
            placeholder="Nuevo Sol"
          />
        </div>

        <div className="form-field">
          <label>Usuario</label>
          <input
            type="text"
            name="usuario"
            value={formData.usuario}
            onChange={handleChange}
            placeholder="interface.servicios"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label>Fecha Solicitud</label>
          <input
            type="date"
            name="fechaSolicitud"
            value={formData.fechaSolicitud}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label>Fecha Cliente</label>
          <input
            type="date"
            name="fechaCliente"
            value={formData.fechaCliente}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label>Fecha Efectiva</label>
          <input
            type="date"
            name="fechaEfectiva"
            value={formData.fechaEfectiva}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Procesando...' : '🔄 Traducir Endoso'}
        </button>
        <button type="button" className="reset-btn" onClick={handleReset}>
          🔄 Restablecer
        </button>
      </div>
    </form>
  );
}

export default EndorseForm;

