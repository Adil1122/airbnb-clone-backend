"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyRule = exports.RuleDisplayType = void 0;
const typeorm_1 = require("typeorm");
const property_entity_1 = require("./property.entity");
var RuleDisplayType;
(function (RuleDisplayType) {
    RuleDisplayType["ICON_TEXT"] = "icon_text";
    RuleDisplayType["CHECKBOX"] = "checkbox";
    RuleDisplayType["TEXT_ONLY"] = "text_only";
})(RuleDisplayType || (exports.RuleDisplayType = RuleDisplayType = {}));
let PropertyRule = class PropertyRule {
    id;
    propertyId;
    property;
    categoryId;
    categoryName;
    categoryIcon;
    title;
    description;
    isPositive;
    displayType;
    sortOrder;
};
exports.PropertyRule = PropertyRule;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PropertyRule.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], PropertyRule.prototype, "propertyId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => property_entity_1.Property, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'propertyId' }),
    __metadata("design:type", property_entity_1.Property)
], PropertyRule.prototype, "property", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], PropertyRule.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], PropertyRule.prototype, "categoryName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], PropertyRule.prototype, "categoryIcon", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], PropertyRule.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PropertyRule.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], PropertyRule.prototype, "isPositive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: RuleDisplayType, default: RuleDisplayType.ICON_TEXT }),
    __metadata("design:type", String)
], PropertyRule.prototype, "displayType", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], PropertyRule.prototype, "sortOrder", void 0);
exports.PropertyRule = PropertyRule = __decorate([
    (0, typeorm_1.Entity)('property_rules')
], PropertyRule);
//# sourceMappingURL=property-rule.entity.js.map