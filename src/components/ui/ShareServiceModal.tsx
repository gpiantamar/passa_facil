import React, { useState } from "react";
import { MessageCircle, Copy, Check, Share2 } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import type { Service } from "../../types";
import {
  generateServiceShareText,
  shareViaWhatsApp,
  copyToClipboard,
} from "../../utils/shareUtils";

interface ShareServiceModalProps {
  open: boolean;
  onClose: () => void;
  service: Service;
}

export function ShareServiceModal({
  open,
  onClose,
  service,
}: ShareServiceModalProps) {
  const [copied, setCopied] = useState(false);
  const text = generateServiceShareText(service);

  const handleWhatsApp = () => {
    shareViaWhatsApp(service.clientPhone, text);
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Native share API (mobile browsers)
  const canNativeShare =
    typeof navigator !== "undefined" && !!navigator.share;

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: `Serviço #${service.code} — PassaFácil`,
        text,
      });
    } catch {
      // User cancelled or not supported
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Compartilhar com cliente" size="md">
      <div className="flex flex-col gap-4">
        {/* Client info */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
          <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-indigo-700">
              {service.clientName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{service.clientName}</p>
            <p className="text-xs text-slate-500">{service.clientPhone}</p>
          </div>
        </div>

        {/* Preview */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
            Prévia da mensagem
          </p>
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5 max-h-64 overflow-y-auto">
            <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
              {text}
            </pre>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5 pt-1">
          {/* WhatsApp — primary */}
          <Button
            fullWidth
            size="lg"
            onClick={handleWhatsApp}
            className="bg-[#25D366] hover:bg-[#1ebe5d] active:bg-[#1aa352] shadow-sm shadow-green-200"
            leftIcon={<MessageCircle className="w-5 h-5" />}
          >
            Enviar pelo WhatsApp
          </Button>

          {/* Native share (mobile) */}
          {canNativeShare && (
            <Button
              fullWidth
              variant="outline"
              onClick={handleNativeShare}
              leftIcon={<Share2 className="w-4 h-4" />}
            >
              Compartilhar via...
            </Button>
          )}

          {/* Copy */}
          <Button
            fullWidth
            variant="secondary"
            onClick={handleCopy}
            leftIcon={
              copied ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )
            }
          >
            {copied ? "Texto copiado!" : "Copiar texto"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
