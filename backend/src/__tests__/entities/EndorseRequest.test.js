const EndorseRequest = require('../../entities/EndorseRequest.entity');

describe('EndorseRequest Entity', () => {
  describe('constructor', () => {
    it('should create entity with all fields', () => {
      const data = {
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

      const entity = new EndorseRequest(data);

      expect(entity.policyNumber).toBe('08200000049');
      expect(entity.idEnvio).toBe(5984);
      expect(entity.frecuencia).toBe('Semestral');
      expect(entity.tipoEndoso).toBe('CambioFrecuencia');
      expect(entity.producto).toBe('Rumbo');
      expect(entity.plan).toBe('PlanRumbo');
      expect(entity.moneda).toBe('Nuevo Sol');
      expect(entity.usuario).toBe('interface.servicios');
    });

    it('should create entity with empty object when no data provided', () => {
      const entity = new EndorseRequest();

      expect(entity.policyNumber).toBeUndefined();
      expect(entity.idEnvio).toBeUndefined();
    });
  });

  describe('validate', () => {
    it('should return valid when all required fields are present', () => {
      const entity = new EndorseRequest({
        policyNumber: '08200000049',
        idEnvio: 5984,
        tipoEndoso: 'CambioFrecuencia',
        producto: 'Rumbo',
      });

      const result = entity.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return invalid when policyNumber is missing', () => {
      const entity = new EndorseRequest({
        idEnvio: 5984,
        tipoEndoso: 'CambioFrecuencia',
        producto: 'Rumbo',
      });

      const result = entity.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('policyNumber is required');
    });

    it('should return invalid when idEnvio is missing', () => {
      const entity = new EndorseRequest({
        policyNumber: '08200000049',
        tipoEndoso: 'CambioFrecuencia',
        producto: 'Rumbo',
      });

      const result = entity.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('idEnvio is required');
    });

    it('should return invalid when tipoEndoso is missing', () => {
      const entity = new EndorseRequest({
        policyNumber: '08200000049',
        idEnvio: 5984,
        producto: 'Rumbo',
      });

      const result = entity.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('tipoEndoso is required');
    });

    it('should return invalid when producto is missing', () => {
      const entity = new EndorseRequest({
        policyNumber: '08200000049',
        idEnvio: 5984,
        tipoEndoso: 'CambioFrecuencia',
      });

      const result = entity.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('producto is required');
    });

    it('should return all errors when multiple fields are missing', () => {
      const entity = new EndorseRequest({});

      const result = entity.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });
});

