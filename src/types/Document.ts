export type DocumentType = "ID_FRONT" | "ID_BACK" | "SELFIE";

export type KycDocument = {
  type: DocumentType;
  ref: string;
};
