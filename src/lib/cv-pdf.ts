/**
 * La ruta pública del PDF del CV en un idioma. El archivo lo genera el build
 * (`scripts/generate-cv-pdf.mjs`, `LABELS[locale].archivo`) en `public/cv/`;
 * un test exige que esta ruta y ese nombre no se separen nunca.
 */
export function rutaDelPdf(locale: string): string {
  return `/cv/Henry-Rincon-CV-${locale.toUpperCase()}.pdf`;
}
