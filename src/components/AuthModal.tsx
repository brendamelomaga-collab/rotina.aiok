import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Mail, Shield, Check } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, userEmail, login } = useApp();

  const [email, setEmail] = useState(userEmail);
  const [password, setPassword] = useState('••••••••');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    login(email.trim());
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsAuthModalOpen(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#FDFBF7] rounded-3xl p-5 shadow-2xl border border-[#EFE8DE] animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-[#EFE8DE]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F4EDE2] flex items-center justify-center text-[#B78A58]">
              <Lock className="w-5 h-5 text-[#8C7A6B]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#2C2C2C]">Conta & Acesso Seguro</h2>
              <p className="text-xs text-[#8C7A6B]">Sincronização da Família</p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="w-8 h-8 rounded-full bg-[#F4EDE2] hover:bg-[#EAE0D2] flex items-center justify-center text-[#5C4F44]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-[#3C3C3C] mb-1">
              E-mail do Responsável Principal
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8C7A6B] absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@rotina.ai"
                className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border border-[#EFE8DE] rounded-2xl text-xs text-[#2C2C2C] focus:outline-none focus:ring-2 focus:ring-[#8C7A6B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3C3C3C] mb-1">
              Senha de Proteção
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8C7A6B] absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border border-[#EFE8DE] rounded-2xl text-xs text-[#2C2C2C] focus:outline-none focus:ring-2 focus:ring-[#8C7A6B]"
              />
            </div>
          </div>

          <div className="bg-[#F7F2EA] border border-[#E8DFC8] rounded-2xl p-3 flex items-start gap-2 text-[11px] text-[#5C4F44]">
            <Shield className="w-4 h-4 text-[#8C7A6B] shrink-0 mt-0.5" />
            <span>
              Os dados de saúde, rotinas e humor da sua família são criptografados localmente e vinculados ao perfil principal da Brenda.
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-[#8C7A6B] hover:bg-[#786657] text-white text-xs font-bold transition-all shadow-sm active:scale-98 flex items-center justify-center gap-2"
          >
            {isSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Salvo com sucesso!</span>
              </>
            ) : (
              <span>Atualizar dados da conta</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
