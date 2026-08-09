import { CheckCircle2, XCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "success" | "error";
  title?: string;
  message: string;
  errorCode?: number | string | null;
}

export const ModalComponent = ({ 
  isOpen, 
  onClose, 
  type, 
  title, 
  message, 
  errorCode 
}: AlertModalProps) => {
  
  const isSuccess = type === "success";

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-bg-surface border-border-strong shadow-modal rounded-3xl max-w-sm">
        <AlertDialogHeader className="flex flex-col items-center gap-2">
          
          {/* Ícono dinámico */}
          {isSuccess ? (
            <CheckCircle2 className="w-16 h-16 text-status-success mb-2" />
          ) : (
            <XCircle className="w-16 h-16 text-status-danger mb-2" />
          )}
          
          {/* Título dinámico (Si no se envía uno, usa uno por defecto) */}
          <AlertDialogTitle className="text-2xl font-black text-heading-text text-center">
            {title || (isSuccess ? "¡Éxito!" : "¡Error!")}
          </AlertDialogTitle>
          
          {/* Mensaje y Código de Error (si existe) */}
          <AlertDialogDescription className="text-muted-text font-medium text-center text-base flex flex-col gap-3 items-center">
            <span>{message}</span>
            
            {/* Solo se renderiza si es error y viene un código HTTP */}
            {!isSuccess && errorCode && (
              <span className="inline-flex items-center justify-center bg-status-danger/10 text-status-danger text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider border border-status-danger/20">
                HTTP {errorCode}
              </span>
            )}
          </AlertDialogDescription>
          
        </AlertDialogHeader>
        
        <AlertDialogFooter className="sm:justify-center mt-4">
          <AlertDialogAction 
            onClick={onClose}
            className="bg-brand-primary-5 text-brand-primary-1 hover:bg-brand-primary-4 font-bold py-3 px-8 rounded-xl transition-all"
          >
            Aceptar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};