import { Building2, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-6 w-6" />
              <span className="text-xl font-bold">EmpresaPro</span>
            </div>
            <p className="text-sm text-primary-foreground/80">
              Soluciones empresariales de excelencia para tu negocio.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Enlaces</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-accent transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="hover:text-accent transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-accent transition-colors">
                  Iniciar Sesión
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:contacto@empresapro.com" className="hover:text-accent transition-colors">
                  contacto@empresapro.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href="tel:+34900123456" className="hover:text-accent transition-colors">
                  +34 900 123 456
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Madrid, España</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} EmpresaPro. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
