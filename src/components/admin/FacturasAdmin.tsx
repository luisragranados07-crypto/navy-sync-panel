import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { getFacturas, createFactura, updateFactura, deleteFactura, type Factura } from '@/lib/storage';
import { toast } from 'sonner';

export default function FacturasAdmin() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFactura, setEditingFactura] = useState<Factura | null>(null);
  const [formData, setFormData] = useState<{
    clienteId: string;
    numero: string;
    fecha: string;
    monto: string;
    estado: 'pagada' | 'pendiente' | 'vencida';
    concepto: string;
  }>({
    clienteId: '',
    numero: '',
    fecha: new Date().toISOString().split('T')[0],
    monto: '',
    estado: 'pendiente',
    concepto: '',
  });

  useEffect(() => {
    loadFacturas();
  }, []);

  const loadFacturas = () => {
    setFacturas(getFacturas());
  };

  const handleSubmit = () => {
    if (!formData.clienteId || !formData.numero || !formData.monto || !formData.concepto) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    if (editingFactura) {
      updateFactura(editingFactura.id, {
        ...formData,
        monto: parseFloat(formData.monto),
      });
      toast.success('Factura actualizada correctamente');
    } else {
      createFactura({
        ...formData,
        monto: parseFloat(formData.monto),
      });
      toast.success('Factura creada correctamente');
    }

    loadFacturas();
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (factura: Factura) => {
    setEditingFactura(factura);
    setFormData({
      clienteId: factura.clienteId,
      numero: factura.numero,
      fecha: factura.fecha.split('T')[0],
      monto: factura.monto.toString(),
      estado: factura.estado,
      concepto: factura.concepto,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta factura?')) {
      deleteFactura(id);
      toast.success('Factura eliminada correctamente');
      loadFacturas();
    }
  };

  const resetForm = () => {
    setEditingFactura(null);
    setFormData({
      clienteId: '',
      numero: '',
      fecha: new Date().toISOString().split('T')[0],
      monto: '',
      estado: 'pendiente',
      concepto: '',
    });
  };

  const getEstadoBadge = (estado: string) => {
    const variants = {
      pagada: 'default',
      pendiente: 'secondary',
      vencida: 'destructive',
    };
    return <Badge variant={variants[estado as keyof typeof variants] as any}>{estado.toUpperCase()}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Gestión de Facturación</CardTitle>
            <CardDescription>Administra todas las facturas del sistema</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Factura
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingFactura ? 'Editar Factura' : 'Nueva Factura'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Cliente ID</Label>
                  <Input
                    value={formData.clienteId}
                    onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })}
                    placeholder="cliente-1"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Número de Factura</Label>
                  <Input
                    value={formData.numero}
                    onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                    placeholder="F-000001"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fecha</Label>
                  <Input
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Monto</Label>
                  <Input
                    type="number"
                    value={formData.monto}
                    onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                    placeholder="1000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Select value={formData.estado} onValueChange={(value: any) => setFormData({ ...formData, estado: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pagada">Pagada</SelectItem>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="vencida">Vencida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Concepto</Label>
                  <Input
                    value={formData.concepto}
                    onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
                    placeholder="Servicios profesionales"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit}>
                  {editingFactura ? 'Actualizar' : 'Crear'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Cliente ID</TableHead>
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
                  <TableCell>{factura.clienteId}</TableCell>
                  <TableCell>{new Date(factura.fecha).toLocaleDateString('es-ES')}</TableCell>
                  <TableCell>{factura.concepto}</TableCell>
                  <TableCell>${factura.monto.toLocaleString()}</TableCell>
                  <TableCell>{getEstadoBadge(factura.estado)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(factura)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(factura.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
