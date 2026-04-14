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
exports.PropertyRules = void 0;
const typeorm_1 = require("typeorm");
const property_entity_1 = require("./property.entity");
let PropertyRules = class PropertyRules {
    id;
    propertyId;
    property;
    checkInTime;
    checkOutTime;
    maxGuests;
    additionalHouseRules;
    smokingAllowed;
    petsAllowed;
    partiesAllowed;
    quietHours;
    smokeAlarm;
    carbonMonoxideAlarm;
    securityCamera;
    weaponOnProperty;
    cancellationPolicy;
    cancellationPolicyDesc;
    refundCutoffDays;
};
exports.PropertyRules = PropertyRules;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PropertyRules.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], PropertyRules.prototype, "propertyId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => property_entity_1.Property),
    (0, typeorm_1.JoinColumn)({ name: 'propertyId' }),
    __metadata("design:type", property_entity_1.Property)
], PropertyRules.prototype, "property", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '3:00 PM' }),
    __metadata("design:type", String)
], PropertyRules.prototype, "checkInTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '11:00 AM' }),
    __metadata("design:type", String)
], PropertyRules.prototype, "checkOutTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 5 }),
    __metadata("design:type", Number)
], PropertyRules.prototype, "maxGuests", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PropertyRules.prototype, "additionalHouseRules", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], PropertyRules.prototype, "smokingAllowed", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], PropertyRules.prototype, "petsAllowed", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], PropertyRules.prototype, "partiesAllowed", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], PropertyRules.prototype, "quietHours", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], PropertyRules.prototype, "smokeAlarm", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], PropertyRules.prototype, "carbonMonoxideAlarm", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], PropertyRules.prototype, "securityCamera", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], PropertyRules.prototype, "weaponOnProperty", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'flexible' }),
    __metadata("design:type", String)
], PropertyRules.prototype, "cancellationPolicy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PropertyRules.prototype, "cancellationPolicyDesc", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], PropertyRules.prototype, "refundCutoffDays", void 0);
exports.PropertyRules = PropertyRules = __decorate([
    (0, typeorm_1.Entity)('property_rules')
], PropertyRules);
//# sourceMappingURL=property-rules.entity.js.map