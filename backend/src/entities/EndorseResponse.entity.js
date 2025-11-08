/**
 * ENTITY (DTO): Representa la estructura de respuesta estructurada
 * Se usa en Controller y Service para definir la estructura de salida
 */
class EndorseResponse {
  constructor() {
    this.policyNumber = null;
    this.idEnvio = null;
    this.financialPlansEntity = null;
    this.currency = null;
    this.productEntity = null;
    this.eventEntity = null;
    this.eventAppliedEntities = [];
    this.riskUnitEntities = [];
    this.participationEntities = [];
  }
}

module.exports = EndorseResponse;

