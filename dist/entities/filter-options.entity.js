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
exports.SearchDuration = exports.GuestCategory = void 0;
const typeorm_1 = require("typeorm");
let GuestCategory = class GuestCategory {
    id;
    label;
    sublabel;
    type;
};
exports.GuestCategory = GuestCategory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], GuestCategory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GuestCategory.prototype, "label", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GuestCategory.prototype, "sublabel", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GuestCategory.prototype, "type", void 0);
exports.GuestCategory = GuestCategory = __decorate([
    (0, typeorm_1.Entity)('guest_categories')
], GuestCategory);
let SearchDuration = class SearchDuration {
    id;
    label;
    value;
};
exports.SearchDuration = SearchDuration;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SearchDuration.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SearchDuration.prototype, "label", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SearchDuration.prototype, "value", void 0);
exports.SearchDuration = SearchDuration = __decorate([
    (0, typeorm_1.Entity)('search_durations')
], SearchDuration);
//# sourceMappingURL=filter-options.entity.js.map