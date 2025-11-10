import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getEmpleados, getFaltas } from '@/lib/storage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, UserX, TrendingUp, TrendingDown } from 'lucide-react';

export default function DashboardAdmin() {
  const empleados = getEmpleados();
  const faltas = getFaltas();
  const empleadosActivos = empleados.filter((e) => e.activo);

  // Top 10 operarios por ranking
  const topRanking = [...empleados].sort((a, b) => b.ranking - a.ranking).slice(0, 10);

  // Top 10 con más faltas
  const topFaltas = [...empleados].sort((a, b) => b.faltas - a.faltas).slice(0, 10);

  // Top 10 mejor puntuados
  const topPuntuados = [...empleados].sort((a, b) => b.puntuacion - a.puntuacion).slice(0, 10);

  // Top 10 peor puntuados
  const worstPuntuados = [...empleados].sort((a, b) => a.puntuacion - b.puntuacion).slice(0, 10);

  // Faltas mensuales
  const faltasPorMes = faltas.reduce((acc: any, falta) => {
    const mes = new Date(falta.fecha).toLocaleString('es-ES', { month: 'short' });
    acc[mes] = (acc[mes] || 0) + 1;
    return acc;
  }, {});

  const faltasMensualesData = Object.entries(faltasPorMes).map(([mes, cantidad]) => ({
    mes,
    faltas: cantidad,
  }));

  const stats = [
    {
      title: 'Empleados Activos',
      value: empleadosActivos.length,
      total: empleados.length,
      icon: Users,
      color: 'text-green-600',
    },
    {
      title: 'Total Faltas',
      value: faltas.length,
      icon: UserX,
      color: 'text-red-600',
    },
    {
      title: 'Promedio Puntuación',
      value: Math.round(empleados.reduce((sum, e) => sum + e.puntuacion, 0) / empleados.length),
      icon: TrendingUp,
      color: 'text-primary',
    },
    {
      title: 'Promedio Ranking',
      value: Math.round(empleados.reduce((sum, e) => sum + e.ranking, 0) / empleados.length),
      icon: TrendingDown,
      color: 'text-accent',
    },
  ];

  const COLORS = ['hsl(221, 83%, 33%)', 'hsl(221, 70%, 55%)', 'hsl(220, 15%, 45%)', 'hsl(0, 84%, 60%)'];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
                {stat.total && <span className="text-sm text-muted-foreground ml-1">/ {stat.total}</span>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Operarios por Ranking</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topRanking}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" angle={-45} textAnchor="end" height={100} fontSize={12} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="ranking" fill="hsl(221, 83%, 33%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 10 con Más Faltas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topFaltas}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" angle={-45} textAnchor="end" height={100} fontSize={12} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="faltas" fill="hsl(0, 84%, 60%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Mejor Puntuados</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topPuntuados}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" angle={-45} textAnchor="end" height={100} fontSize={12} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="puntuacion" fill="hsl(221, 70%, 55%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 10 Peor Puntuados</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={worstPuntuados}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" angle={-45} textAnchor="end" height={100} fontSize={12} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="puntuacion" fill="hsl(220, 15%, 45%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Faltas Mensuales */}
      <Card>
        <CardHeader>
          <CardTitle>Faltas Mensuales (2024)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={faltasMensualesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="faltas" fill="hsl(221, 83%, 33%)" name="Faltas" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
