import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2, Download } from 'lucide-react';
import { getNominas, createNomina, updateNomina, deleteNomina, type Nomina } from '@/lib/storage';
import { toast } from 'sonner';

export default function NominasAdmin() {
  const [nominas, setNominas] = useState<Nomina[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNomina, setEditingNomina] = useState<Nomina | null>(null);
  const [formData, setFormData] = useState({
    empleadoId: '',
    mes: '',
    año: new Date().getFullYear().toString(),
    salario: '',
    bonos: '',
    deducciones: '',
  });

  useEffect(() => {
    loadNominas();
  }, []);

  const loadNominas = () => {
    setNominas(getNominas());
  };

  const handleSubmit = () => {
    if (!formData.empleadoId || !formData.mes || !formData.año || !formData.salario) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    const salario = parseFloat(formData.salario);
    const bonos = parseFloat(formData.bonos || '0');
    const deducciones = parseFloat(formData.deducciones || '0');
    const total = salario + bonos - deducciones;

    if (editingNomina) {
      updateNomina(editingNomina.id, {
        ...formData,
        año: parseInt(formData.año),
        salario,
        bonos,
        deducciones,
        total,
      });
      toast.success('Nómina actualizada correctamente');
    } else {
      createNomina({
        ...formData,
        año: parseInt(formData.año),
        salario,
        bonos,
        deducciones,
        total,
      });
      toast.success('Nómina creada correctamente');
    }

    loadNominas();
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (nomina: Nomina) => {
    setEditingNomina(nomina);
    setFormData({
      empleadoId: nomina.empleadoId,
      mes: nomina.mes,
      año: nomina.año.toString(),
      salario: nomina.salario.toString(),
      bonos: nomina.bonos.toString(),
      deducciones: nomina.deducciones.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta nómina?')) {
      deleteNomina(id);
      toast.success('Nómina eliminada correctamente');
      loadNominas();
    }
  };

  const resetForm = () => {
    setEditingNomina(null);
    setFormData({
      empleadoId: '',
      mes: '',
      año: new Date().getFullYear().toString(),
      salario: '',
      bonos: '',
      deducciones: '',
    });
  };

  const exportToCSV = () => {
    const headers = ['Empleado ID', 'Mes', 'Año', 'Salario', 'Bonos', 'Deducciones', 'Total'];
    const rows = nominas.map((n) => [n.empleadoId, n.mes, n.año, n.salario, n.bonos, n.deducciones, n.total]);
    
    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nominas.csv';
    a.click();
    
    toast.success('Nóminas exportadas a CSV');
  };

  const exportToJSON = () => {
    const json = JSON.stringify(nominas, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nominas.json';
    a.click();
    
    toast.success('Nóminas exportadas a JSON');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle>Gestión de Nómina</CardTitle>
            <CardDescription>Administra las nóminas de todos los empleados</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportToCSV}>
              <Download className="mr-2 h-4 w-4" />
              CSV
            </Button>
            <Button variant="outline" onClick={exportToJSON}>
              <Download className="mr-2 h-4 w-4" />
              JSON
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Nómina
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingNomina ? 'Editar Nómina' : 'Nueva Nómina'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Empleado ID</Label>
                    <Input
                      value={formData.empleadoId}
                      onChange={(e) => setFormData({ ...formData, empleadoId: e.target.value })}
                      placeholder="emp-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Mes</Label>
                      <Input
                        value={formData.mes}
                        onChange={(e) => setFormData({ ...formData, mes: e.target.value })}
                        placeholder="enero"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Año</Label>
                      <Input
                        type="number"
                        value={formData.año}
                        onChange={(e) => setFormData({ ...formData, año: e.target.value })}
                        placeholder="2024"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Salario Base</Label>
                    <Input
                      type="number"
                      value={formData.salario}
                      onChange={(e) => setFormData({ ...formData, salario: e.target.value })}
                      placeholder="15000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bonos</Label>
                    <Input
                      type="number"
                      value={formData.bonos}
                      onChange={(e) => setFormData({ ...formData, bonos: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Deducciones</Label>
                    <Input
                      type="number"
                      value={formData.deducciones}
                      onChange={(e) => setFormData({ ...formData, deducciones: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSubmit}>
                    {editingNomina ? 'Actualizar' : 'Crear'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empleado ID</TableHead>
                <TableHead>Mes</TableHead>
                <TableHead>Año</TableHead>
                <TableHead>Salario</TableHead>
                <TableHead>Bonos</TableHead>
                <TableHead>Deducciones</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nominas.slice(0, 50).map((nomina) => (
                <TableRow key={nomina.id}>
                  <TableCell className="font-medium">{nomina.empleadoId}</TableCell>
                  <TableCell className="capitalize">{nomina.mes}</TableCell>
                  <TableCell>{nomina.año}</TableCell>
                  <TableCell>${nomina.salario.toLocaleString()}</TableCell>
                  <TableCell>${nomina.bonos.toLocaleString()}</TableCell>
                  <TableCell>${nomina.deducciones.toLocaleString()}</TableCell>
                  <TableCell className="font-bold">${nomina.total.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(nomina)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(nomina.id)}>
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
