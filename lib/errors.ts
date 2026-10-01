import { ApiError } from "@/services/api";

export interface FriendlyError {
  message: string;
  details: string[];
}

/**
 * Converte qualquer erro em texto para a interface. As mensagens da API já
 * vêm em português; aqui só cobrimos falha de rede e erros inesperados.
 */
export function toFriendlyError(error: unknown): FriendlyError {
  if (error instanceof ApiError) {
    if (error.isNetworkError) {
      return {
        message: "Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.",
        details: [],
      };
    }
    if (error.status >= 500 && /^Erro \d+$/.test(error.message)) {
      return { message: "Ocorreu um erro inesperado. Tente novamente em instantes.", details: [] };
    }
    return { message: error.message, details: error.details };
  }
  return { message: "Ocorreu um erro inesperado. Tente novamente.", details: [] };
}

export function friendlyMessage(error: unknown): string {
  const { message, details } = toFriendlyError(error);
  return details.length ? `${message} ${details.join(" ")}` : message;
}
