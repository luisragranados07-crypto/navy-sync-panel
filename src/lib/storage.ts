// LocalStorage utilities para gestión de datos

export interface User {
  id: string;
  username: string;
  password: string;
  role: 'cliente' | 'admin';
  email: string;
  nombre: string;
}

export interface Factura {
  id: string;
  clienteId: string;
  numero: string;
  fecha: string;
  monto: number;
  estado: 'pagada' | 'pendiente' | 'vencida';
  concepto: string;
}

export interface Nomina {
  id: string;
  empleadoId: string;
  mes: string;
  año: number;
  salario: number;
  bonos: number;
  deducciones: number;
  total: number;
}

export interface Empleado {
  id: string;
  nombre: string;
  puesto: string;
  ranking: number;
  faltas: number;
  puntuacion: number;
  activo: boolean;
}

export interface Falta {
  id: string;
  empleadoId: string;
  fecha: string;
  mes: string;
  año: number;
  motivo: string;
}

export interface Transaction {
  id: string;
  clienteId: string;
  fecha: string;
  concepto: string;
  monto: number;
  tipo: 'ingreso' | 'egreso';
}

const STORAGE_KEYS = {
  USERS: 'app_users',
  FACTURAS: 'app_facturas',
  NOMINAS: 'app_nominas',
  EMPLEADOS: 'app_empleados',
  FALTAS: 'app_faltas',
  TRANSACTIONS: 'app_transactions',
  CURRENT_USER: 'app_current_user',
};

// Datos semilla
export function initializeData() {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const users: User[] = [
      {
        id: '1',
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        email: 'admin@empresa.com',
        nombre: 'Administrador',
      },
      ...Array.from({ length: 25 }, (_, i) => ({
        id: `cliente-${i + 1}`,
        username: `cliente${i + 1}`,
        password: 'cliente123',
        role: 'cliente' as const,
        email: `cliente${i + 1}@empresa.com`,
        nombre: `Cliente ${i + 1}`,
      })),
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  if (!localStorage.getItem(STORAGE_KEYS.EMPLEADOS)) {
    const empleados: Empleado[] = Array.from({ length: 50 }, (_, i) => ({
      id: `emp-${i + 1}`,
      nombre: `Empleado ${i + 1}`,
      puesto: ['Operario', 'Supervisor', 'Técnico', 'Gerente'][Math.floor(Math.random() * 4)],
      ranking: Math.floor(Math.random() * 100) + 1,
      faltas: Math.floor(Math.random() * 15),
      puntuacion: Math.floor(Math.random() * 50) + 50,
      activo: Math.random() > 0.1,
    }));
    localStorage.setItem(STORAGE_KEYS.EMPLEADOS, JSON.stringify(empleados));
  }

  if (!localStorage.getItem(STORAGE_KEYS.FACTURAS)) {
    const facturas: Factura[] = Array.from({ length: 100 }, (_, i) => ({
      id: `fact-${i + 1}`,
      clienteId: `cliente-${(i % 25) + 1}`,
      numero: `F-${String(i + 1).padStart(6, '0')}`,
      fecha: new Date(2024, Math.floor(i / 9), (i % 28) + 1).toISOString(),
      monto: Math.floor(Math.random() * 50000) + 1000,
      estado: ['pagada', 'pendiente', 'vencida'][Math.floor(Math.random() * 3)] as any,
      concepto: 'Servicios profesionales',
    }));
    localStorage.setItem(STORAGE_KEYS.FACTURAS, JSON.stringify(facturas));
  }

  if (!localStorage.getItem(STORAGE_KEYS.NOMINAS)) {
    const nominas: Nomina[] = [];
    const empleados = getEmpleados();
    empleados.forEach((emp) => {
      for (let mes = 0; mes < 12; mes++) {
        nominas.push({
          id: `nom-${emp.id}-${mes}`,
          empleadoId: emp.id,
          mes: new Date(2024, mes).toLocaleString('es-ES', { month: 'long' }),
          año: 2024,
          salario: Math.floor(Math.random() * 20000) + 15000,
          bonos: Math.floor(Math.random() * 5000),
          deducciones: Math.floor(Math.random() * 3000),
          total: 0,
        });
      }
    });
    nominas.forEach((n) => {
      n.total = n.salario + n.bonos - n.deducciones;
    });
    localStorage.setItem(STORAGE_KEYS.NOMINAS, JSON.stringify(nominas));
  }

  if (!localStorage.getItem(STORAGE_KEYS.FALTAS)) {
    const faltas: Falta[] = [];
    const empleados = getEmpleados();
    empleados.forEach((emp) => {
      const numFaltas = emp.faltas;
      for (let i = 0; i < numFaltas; i++) {
        const mes = Math.floor(Math.random() * 12);
        faltas.push({
          id: `falta-${emp.id}-${i}`,
          empleadoId: emp.id,
          fecha: new Date(2024, mes, Math.floor(Math.random() * 28) + 1).toISOString(),
          mes: new Date(2024, mes).toLocaleString('es-ES', { month: 'long' }),
          año: 2024,
          motivo: ['Enfermedad', 'Personal', 'Justificada', 'Injustificada'][Math.floor(Math.random() * 4)],
        });
      }
    });
    localStorage.setItem(STORAGE_KEYS.FALTAS, JSON.stringify(faltas));
  }

  if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
    const transactions: Transaction[] = Array.from({ length: 200 }, (_, i) => ({
      id: `trans-${i + 1}`,
      clienteId: `cliente-${(i % 25) + 1}`,
      fecha: new Date(2024, Math.floor(i / 17), (i % 28) + 1).toISOString(),
      concepto: ['Pago de factura', 'Abono', 'Cargo por servicio', 'Ajuste'][Math.floor(Math.random() * 4)],
      monto: Math.floor(Math.random() * 30000) + 500,
      tipo: Math.random() > 0.3 ? 'ingreso' : 'egreso',
    }));
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }
}

// Auth
export function login(username: string, password: string): User | null {
  const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  const user = users.find((u) => u.username === username && u.password === password);
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }
  return user || null;
}

export function logout() {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

export function getCurrentUser(): User | null {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
}

// Facturas
export function getFacturas(): Factura[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.FACTURAS) || '[]');
}

export function getFacturasByCliente(clienteId: string): Factura[] {
  return getFacturas().filter((f) => f.clienteId === clienteId);
}

export function createFactura(factura: Omit<Factura, 'id'>): Factura {
  const facturas = getFacturas();
  const newFactura = { ...factura, id: `fact-${Date.now()}` };
  facturas.push(newFactura);
  localStorage.setItem(STORAGE_KEYS.FACTURAS, JSON.stringify(facturas));
  return newFactura;
}

export function updateFactura(id: string, updates: Partial<Factura>) {
  const facturas = getFacturas();
  const index = facturas.findIndex((f) => f.id === id);
  if (index !== -1) {
    facturas[index] = { ...facturas[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.FACTURAS, JSON.stringify(facturas));
  }
}

export function deleteFactura(id: string) {
  const facturas = getFacturas().filter((f) => f.id !== id);
  localStorage.setItem(STORAGE_KEYS.FACTURAS, JSON.stringify(facturas));
}

// Nóminas
export function getNominas(): Nomina[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOMINAS) || '[]');
}

export function createNomina(nomina: Omit<Nomina, 'id'>): Nomina {
  const nominas = getNominas();
  const newNomina = { ...nomina, id: `nom-${Date.now()}` };
  nominas.push(newNomina);
  localStorage.setItem(STORAGE_KEYS.NOMINAS, JSON.stringify(nominas));
  return newNomina;
}

export function updateNomina(id: string, updates: Partial<Nomina>) {
  const nominas = getNominas();
  const index = nominas.findIndex((n) => n.id === id);
  if (index !== -1) {
    nominas[index] = { ...nominas[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.NOMINAS, JSON.stringify(nominas));
  }
}

export function deleteNomina(id: string) {
  const nominas = getNominas().filter((n) => n.id !== id);
  localStorage.setItem(STORAGE_KEYS.NOMINAS, JSON.stringify(nominas));
}

// Empleados
export function getEmpleados(): Empleado[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.EMPLEADOS) || '[]');
}

export function getFaltas(): Falta[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.FALTAS) || '[]');
}

// Transactions
export function getTransactionsByCliente(clienteId: string): Transaction[] {
  const transactions: Transaction[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]');
  return transactions.filter((t) => t.clienteId === clienteId);
}
