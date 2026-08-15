import { useState, useEffect, type FormEvent } from "react";

interface InputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
  title: string;
  description: string;
  initialValue?: string;
  buttonText?: string;
}

export const InputModalComponent = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  description,
  initialValue = "",
  buttonText = "Guardar",
}: InputModalProps) => {
  const [inputValue, setInputValue] = useState(initialValue);

  // Sincroniza el valor inicial cada vez que se abre el modal o cambia el valor
  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onSubmit(inputValue.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/20 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border-2 border-blue-900/20 shadow-xl rounded-3xl p-6 w-full max-w-sm mx-4 animate-in zoom-in-95 duration-200">
        <h3 className="text-2xl font-black text-blue-950 mb-2">{title}</h3>
        <p className="text-blue-900/70 font-medium text-sm mb-4">{description}</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            autoFocus
            placeholder="Ej: Taller de Ecuaciones..."
            className="w-full bg-blue-900/5 border-2 border-blue-900/20 focus:border-blue-900 outline-none text-blue-950 px-4 py-3 rounded-xl font-bold transition-all mb-6"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            required
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 font-bold text-blue-900 hover:bg-blue-900/10 rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 font-black bg-blue-900 text-white rounded-xl shadow-[3px_3px_0_rgba(30,58,138,0.3)] hover:shadow-none hover:translate-y-0.5 hover:translate-x-0.5 transition-all uppercase tracking-wider text-sm"
            >
              {buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};