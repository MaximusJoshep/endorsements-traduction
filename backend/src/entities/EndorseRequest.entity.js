/**
 * ENTITY (DTO): Representa la estructura de datos usada en Controller y Service
 * Esta capa define las reglas de negocio y validaciones de los objetos
 * Se utiliza hasta la capa de Service, no se persiste directamente en BD
 */
class EndorseRequest {
  constructor(data = {}) {
    this.policyNumber = data.policyNumber;
    this.idEnvio = data.idEnvio;
    this.frecuencia = data.frecuencia;
    this.tipoEndoso = data.tipoEndoso;
    this.producto = data.producto;
    this.plan = data.plan;
    this.moneda = data.moneda;
    this.usuario = data.usuario;
    this.fechaSolicitud = data.fechaSolicitud;
    this.fechaCliente = data.fechaCliente;
    this.fechaEfectiva = data.fechaEfectiva;
  }

  validate() {
    const errors = [];
    
    if (!this.policyNumber) errors.push('policyNumber is required');
    if (!this.idEnvio) errors.push('idEnvio is required');
    if (!this.tipoEndoso) errors.push('tipoEndoso is required');
    if (!this.producto) errors.push('producto is required');
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

module.exports = EndorseRequest;

