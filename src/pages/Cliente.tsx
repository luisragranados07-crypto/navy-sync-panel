import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, FileText, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { getCurrentUser, getFacturasByCliente, getTransactionsByCliente, type Factura, type Transaction } from '@/lib/storage';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

export default function Cliente() {
  const user = getCurrentUser();
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [saldo, setSaldo] = useState(0);

  useEffect(() => {
    if (user) {
      const userFacturas = getFacturasByCliente(user.id);
      const userTransactions = getTransactionsByCliente(user.id);
      setFacturas(userFacturas);
      setTransactions(userTransactions);

      // Calcular saldo
      const ingresos = userTransactions.filter((t) => t.tipo === 'ingreso').reduce((sum, t) => sum + t.monto, 0);
      const egresos = userTransactions.filter((t) => t.tipo === 'egreso').reduce((sum, t) => sum + t.monto, 0);
      setSaldo(ingresos - egresos);
    }
  }, [user]);

  const downloadFactura = (factura: Factura) => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('FACTURA', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Número: ${factura.numero}`, 20, 40);
    doc.text(`Fecha: ${new Date(factura.fecha).toLocaleDateString('es-ES')}`, 20, 50);
    doc.text(`Cliente: ${user?.nombre}`, 20, 60);
    doc.text(`Concepto: ${factura.concepto}`, 20, 70);
    doc.text(`Monto: $${factura.monto.toLocaleString()}`, 20, 80);
    doc.text(`Estado: ${factura.estado.toUpperCase()}`, 20, 90);
    
    doc.save(`factura-${factura.numero}.pdf`);
    toast.success('Factura descargada correctamente');
  };

  const getEstadoBadge = (estado: string) => {
    const variants = {
      pagada: 'default',
      pendiente: 'secondary',
      vencida: 'destructive',
    };
    return <Badge variant={variants[estado as keyof typeof variants] as any}>{estado.toUpperCase()}</Badge>;
  };

  const stats = [
    {
      title: 'Saldo Actual',
      value: `$${saldo.toLocaleString()}`,
      icon: DollarSign,
      color: saldo >= 0 ? 'text-green-600' : 'text-red-600',
    },
    {
      title: 'Total Facturas',
      value: facturas.length,
      icon: FileText,
      color: 'text-primary',
    },
    {
      title: 'Facturas Pendientes',
      value: facturas.filter((f) => f.estado === 'pendiente').length,
      icon: FileText,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">Panel de Cliente</h1>
            <p className="text-muted-foreground">Bienvenido, {user?.nombre}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Tabs defaultValue="facturas" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="facturas">Facturación</TabsTrigger>
              <TabsTrigger value="estado">Estado de Cuenta</TabsTrigger>
            </TabsList>

            <TabsContent value="facturas">
              <Card>
                <CardHeader>
                  <CardTitle>Mis Facturas</CardTitle>
                  <CardDescription>Historial completo de facturación</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Número</TableHead>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Concepto</TableHead>
                          <TableHead>Monto</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {facturas.map((factura) => (
                          <TableRow key={factura.id}>
                            <TableCell className="font-medium">{factura.numero}</TableCell>
                            <TableCell>{new Date(factura.fecha).toLocaleDateString('es-ES')}</TableCell>
                            <TableCell>{factura.concepto}</TableCell>
                            <TableCell>${factura.monto.toLocaleString()}</TableCell>
                            <TableCell>{getEstadoBadge(factura.estado)}</TableCell>
                            <TableCell>
                              <Button size="sm" variant="outline" onClick={() => downloadFactura(factura)}>
                                <Download className="h-4 w-4 mr-1" />
                                PDF
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="estado">
              <Card>
                <CardHeader>
                  <CardTitle>Estado de Cuenta</CardTitle>
                  <CardDescription>Movimientos y transacciones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 p-4 bg-primary/5 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Saldo Actual</div>
                    <div className={`text-3xl font-bold ${saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${saldo.toLocaleString()}
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Concepto</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead className="text-right">Monto</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions
                          .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
                          .slice(0, 50)
                          .map((transaction) => (
                            <TableRow key={transaction.id}>
                              <TableCell>{new Date(transaction.fecha).toLocaleDateString('es-ES')}</TableCell>
                              <TableCell>{transaction.concepto}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {transaction.tipo === 'ingreso' ? (
                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <TrendingDown className="h-4 w-4 text-red-600" />
                                  )}
                                  <span className="capitalize">{transaction.tipo}</span>
                                </div>
                              </TableCell>
                              <TableCell className={`text-right font-medium ${transaction.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'}`}>
                                {transaction.tipo === 'ingreso' ? '+' : '-'}${transaction.monto.toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
