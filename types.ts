export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface AnalysisResult {
  markdownReport: string;
}

export interface AnalysisError {
  message: string;
}

export interface ContractAttachment {
  mimeType: string;
  data: string; // base64 encoded string
}

export interface ContractInputProps {
  onAnalyze: (content: string | ContractAttachment) => void;
  isLoading: boolean;
}

export interface ResultDisplayProps {
  report: string;
  onReset: () => void;
}