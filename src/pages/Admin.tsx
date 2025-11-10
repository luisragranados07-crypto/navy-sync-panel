import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCurrentUser } from '@/lib/storage';
import FacturasAdmin from '@/components/admin/FacturasAdmin';
import NominasAdmin from '@/components/admin/NominasAdmin';
import DashboardAdmin from '@/components/admin/DashboardAdmin';

export default function Admin() {
  const user = getCurrentUser();

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">Panel de Administración</h1>
            <p className="text-muted-foreground">Bienvenido, {user?.nombre}</p>
          </div>

          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 max-w-2xl">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="facturas">Facturación</TabsTrigger>
              <TabsTrigger value="nominas">Nómina</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <DashboardAdmin />
            </TabsContent>

            <TabsContent value="facturas">
              <FacturasAdmin />
            </TabsContent>

            <TabsContent value="nominas">
              <NominasAdmin />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
