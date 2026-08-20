/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Identidad de la app en un solo sitio.
 *
 * El nombre estaba repetido en la cabecera, el índice HTML, el manifiesto, la config de
 * Capacitor y los strings de Android. Cambiarlo obligaba a tocar seis archivos y era fácil
 * dejarse uno. Los de configuración siguen siendo archivos aparte porque los lee el
 * empaquetador, pero todo lo que ve el usuario dentro de la app sale de aquí.
 */
export const BRAND = {
  /** Primera palabra del logotipo, en blanco. */
  nombre: "Marcador",
  /** Segunda palabra, la que lleva el degradado. */
  acento: "Probable",
  /** Nombre completo para títulos y metadatos. */
  completo: "Marcador Probable",
  /** Bajo el logotipo. Dice lo que hace, sin prometer certeza. */
  descripcion: "Pronósticos de fútbol con su probabilidad",
  /** Cinta superior. Antes anunciaba un torneo concreto. */
  cinta: "CUALQUIER LIGA · CUALQUIER PARTIDO",
  /** Debe coincidir con appId en capacitor.config.ts y strings.xml. */
  appId: "com.leonardo.marcadorprobable",
} as const;
