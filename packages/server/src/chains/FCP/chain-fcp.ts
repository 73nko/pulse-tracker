import { z } from 'zod';
import { chain, validate } from '@pulse-tracker/utils';
import { testFIDStep } from './testStep';
import { Server } from 'http';

const fcpSchema = z.object({
  rating: z.string(),
  value: z.number(),
});

export const chainFcp = chain('chain-fcp').use(validate({ schema: fcpSchema })); // Todas;
// .use(checkProjectExists); // comprobar si el cliente extiste en la base de datos
// .use(getProjectInfo); // obtener informacion del proyecto
// .use(formatAdditionalData); // formatear datos adicionales (check req info)
// .use(enrichmentMetricData); // enriquecer metrica (añadir datos adicionales)
// .use(saveMetricInDB); // guardar metrica en la base de datos
// .use(checkIfMetricRaisesAlert); // comprobar si la metrica supera el umbral
// .use(sendAlert); // enviar alerta
