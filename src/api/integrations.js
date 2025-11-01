// Integraciones Base44 eliminadas - Ahora usando Supabase
// Este archivo se mantiene para evitar errores de importación legacy

const mockFunction = () => Promise.reject(new Error('Base44 integrations han sido migradas a Supabase'));

export const Core = {
  InvokeLLM: mockFunction,
  SendEmail: mockFunction,
  UploadFile: mockFunction,
  GenerateImage: mockFunction,
  ExtractDataFromUploadedFile: mockFunction,
  CreateFileSignedUrl: mockFunction,
  UploadPrivateFile: mockFunction
};

export const InvokeLLM = mockFunction;
export const SendEmail = mockFunction;
export const UploadFile = mockFunction;
export const GenerateImage = mockFunction;
export const ExtractDataFromUploadedFile = mockFunction;
export const CreateFileSignedUrl = mockFunction;
export const UploadPrivateFile = mockFunction;






