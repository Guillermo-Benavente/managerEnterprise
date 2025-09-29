import { toISO, formatToView } from '../../utils/date';

type FieldSchema = { key: string; type?: string; ignoreInMapper?: boolean; };

export default class MapperBase<TFrontend, TData> {
    private schema: FieldSchema[];
    private overrides?: {
        toData?: Record<string, (value: any, obj: TFrontend) => any>;
        toFrontend?: Record<string, (value: any, obj: TData) => any>;
    };

    constructor(schema: FieldSchema[], overrides?: MapperBase<TFrontend, TData>["overrides"]) {
        this.schema = schema;
        this.overrides = overrides;
    }

    toData(entity: TFrontend): TData {
        const result: any = {};
        const keys = new Set([
            ...this.schema.filter(f => !f.ignoreInMapper).map(f => f.key),
            ...Object.keys(this.overrides?.toData ?? {})
        ]);

        for (const key of keys) {
            const field = this.schema.find(f => f.key === key);
            const type = field?.type;
            const value = (entity as any)[key];
            const override = this.overrides?.toData?.[key];

            if (override) {
                const mapped = override(value, entity);

                if (mapped === undefined) continue;

                if (mapped && typeof mapped === "object" && !Array.isArray(mapped)) {
                    Object.assign(result, mapped);
                } else {
                    result[key] = mapped;
                }
            } else {
                switch (type) {
                    case 'date':
                        result[key] = value ? toISO(value) : null;
                        break;
                    case 'json':
                        result[key] = value ? JSON.stringify(value) : null;
                        break;
                    default:
                        result[key] = value;
                }
            }
        }
        return result as TData;
    }

    toFrontend(data: TData): TFrontend {
        const result: any = {};
        const keys = new Set([
            ...this.schema.filter(f => !f.ignoreInMapper).map(f => f.key),
            ...Object.keys(this.overrides?.toFrontend ?? {})
        ]);

        for (const key of keys) {
            const field = this.schema.find(f => f.key === key);
            const type = field?.type;
            const value = (data as any)[key];
            const override = this.overrides?.toFrontend?.[key];

            if (override) {
                const mapped = override(value, data);

                if (mapped === undefined) continue;
                
                if (mapped && typeof mapped === "object" && !Array.isArray(mapped)) {
                    Object.assign(result, mapped);
                } else {
                    result[key] = mapped;
                }
            } else {
                switch (type) {
                    case 'date':
                        result[key] = value ? formatToView(value) : null;
                        break;
                    case 'json':
                        result[key] = value ? JSON.parse(value as any) : null;
                        break;
                    default:
                        result[key] = value;
                }
            }
        }
        return result as TFrontend;
    }
}
