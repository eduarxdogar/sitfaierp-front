import React, { useState } from 'react';
import { UsuarioIAM, Empresa } from '../types';

interface IAMViewProps {
  usuarios: UsuarioIAM[];
  empresas: Empresa[];
}

export const IAMView: React.FC<IAMViewProps> = ({
  usuarios: initialUsuarios,
  empresas
}) => {
  const [usuarios, setUsuarios] = useState<UsuarioIAM[]>(initialUsuarios);
  const [search, setSearch] = useState('');

  const filteredUsers = usuarios.filter(u => 
    u.nombre.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.rol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1600px] mx-auto w-full pb-10 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[24px] font-bold text-[#0b1c30] tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004ac6] text-[26px]">admin_panel_settings</span>
            Gestión de Identidad y Accesos (IAM)
          </h2>
          <p className="text-[12px] text-[#64748B] mt-0.5">
            Control de roles RBAC, auditores de campo, jefes de almacén y administradores.
          </p>
        </div>

        <button
          onClick={() => alert('Abrir modal de nuevo usuario IAM')}
          className="h-[32px] px-3.5 bg-[#004ac6] text-white rounded text-[12px] font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px]">person_add</span>
          Nuevo Usuario
        </button>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden">
        <div className="p-3 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar usuario por nombre, email o rol..."
            className="h-[32px] px-3 text-[13px] border border-slate-300 rounded focus:border-[#004ac6] outline-none w-72 bg-white"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[10px] font-bold text-slate-500 uppercase">
                <th className="py-2.5 px-3">NOMBRE Y APELLIDO</th>
                <th className="py-2.5 px-3">CORREO CORPORATIVO</th>
                <th className="py-2.5 px-3">ROL ASIGNADO</th>
                <th className="py-2.5 px-3">TENANT / EMPRESA</th>
                <th className="py-2.5 px-3">SUCURSALES AUTORIZADAS</th>
                <th className="py-2.5 px-3">ESTADO</th>
                <th className="py-2.5 px-3 text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((usr) => (
                <tr key={usr.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-slate-800 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[11px]">
                      {usr.nombre.charAt(0)}
                    </span>
                    {usr.nombre}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">{usr.email}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {usr.rol}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 font-medium">{usr.empresaAsignada}</td>
                  <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                    {usr.sucursalesAcceso.join(', ')}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                      {usr.estado}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button className="p-1 text-slate-400 hover:text-blue-600">
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
