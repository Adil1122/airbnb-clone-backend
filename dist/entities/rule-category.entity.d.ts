export declare enum RuleType {
    BOOLEAN = "boolean",
    TEXT = "text",
    NUMBER = "number"
}
export declare class RuleCategory {
    id: number;
    name: string;
    icon: string;
    sortOrder: number;
    isActive: boolean;
}
