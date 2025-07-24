/* eslint-disable  @typescript-eslint/no-explicit-any */
import { ZodSchema } from "zod";

export default function ZodHelper(schema: ZodSchema, data: any) {
    const validate = schema.safeParse(data);
    return {
        ...validate,
    };
}
