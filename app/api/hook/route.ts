import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createEventState } from '../../../database/eventstates';
import { getScenarioHeaderById } from '../../../database/scenarios';
import { EventStateType } from '../../../migrations/00000-createTableEventStates';
import { ScenarioHeaderType } from '../../../migrations/00001-createTableScenarioHeader';

export type Error = {
  error: string;
};

type ScenarioEntityType = {
  scenarioId: ScenarioHeaderType['scenarioId'];
  scenarioEntityId: string;
};

type ScenarioIdResponseBodyGet =
  | { scenarioId: ScenarioHeaderType['scenarioId'] }
  | Error;
type ScenarioIdResponseBodyPost = ScenarioEntityType | Error;

const ScenarioEntitySchema = z.object({
  eventName: z.string(),
  scenarioId: z.string(),
  context: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Record<string, string | string[]> },
): Promise<NextResponse<ScenarioIdResponseBodyGet>> {
  console.log(params);

  // Check if params.scenarioID exits

  /*   const scenarioId = await getScenarioById(params.scenarioId);

  if (!scenarioId) {
    return NextResponse.json(
      {
        error: `scenarioId: ${params.scenarioId} not found`,
      },
      { status: 404 },
    );
  }
 */
  return NextResponse.json({ scenarioId: 4711 });
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<ScenarioIdResponseBodyPost>> {
  const body = await request.json();

  const result = ScenarioEntitySchema.safeParse(body);

  if (!result.success) {
    // zod send you details about the error
    return NextResponse.json(
      {
        error: 'The data is incomplete',
      },
      { status: 400 },
    );
  }

  // Check, if result.data.scenarioId exists
  const scenario = await getScenarioHeaderById(Number(result.data.scenarioId));
  if (!scenario[0]) {
    return NextResponse.json(
      {
        error: `Scenario ${result.data.scenarioId} not found`,
      },
      { status: 404 },
    );
  }
  // Try to cast content to scenario-template-head->contextDataDescription
  /*   const contextDataDescription = scenario[0].contextDataDescription;
  if (contextDataDescription) {
    type MapSchemaTypes = {
      string: string;
      number: number;
      integer: number;
      float: number;
      boolean: boolean;
      object: object;
    };

    type MapSchema<T extends Record<string, keyof MapSchemaTypes>> = {
      -readonly [K in keyof T]: MapSchemaTypes[T[K]];
    };

    // const context = { name: 'string', age: 'integer' } as const;
    const context = { amountToApprov: 'number' } as const;
    type Context = MapSchema<typeof context>;
    if (result.data.context) {
      const tmp: Context = JSON.parse(result.data.context);
      console.log(tmp.amountToApprove);
    }
  } */

  // TODO: Check provided data.context JSON against the schema on the scenario header:
  const literalSchema = z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
  ]);
  type Literal = z.infer<typeof literalSchema>;
  type Json = Literal | { [key: string]: Json } | Json[];
  const jsonSchema: z.ZodType<Json> = z.lazy(() =>
    z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]),
  );
  if (result.data.context) {
    console.log(jsonSchema.parse(JSON.parse(result.data.context)));
  }

  // Save event state to DB:
  const eventEntry = await createEventState({
    scenarioId: Number(result.data.scenarioId),
    stepId: 1,
    eventName: result.data.eventName,
    state: 'FINISHED',
    context: result.data.context,
  });

  if (!eventEntry) {
    return NextResponse.json(
      {
        error: 'Error creating the new eventEntry',
      },
      { status: 500 },
    );
  }

  // Start the processing -->
  // §1 get event state by scenarioEntityId, if not there create new scenarioEntity w reateEventState
  // interate over scanario steps
  // process, write log entry

  // write log table entry

  return NextResponse.json({
    scenarioId: eventEntry.scenarioId,
    scenarioEntityId: eventEntry.scenarioEntityId,
  });
}
