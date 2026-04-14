import { Property } from './property.entity';
export declare enum RuleDisplayType {
    ICON_TEXT = "icon_text",
    CHECKBOX = "checkbox",
    TEXT_ONLY = "text_only"
}
export declare class PropertyRule {
    id: number;
    propertyId: number;
    property: Property;
    categoryId: number;
    categoryName: string;
    categoryIcon: string;
    title: string;
    description: string;
    isPositive: boolean;
    displayType: RuleDisplayType;
    sortOrder: number;
}
