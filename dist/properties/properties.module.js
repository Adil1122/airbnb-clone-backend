"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertiesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const properties_controller_1 = require("./properties.controller");
const properties_service_1 = require("./properties.service");
const property_entity_1 = require("../entities/property.entity");
const property_image_entity_1 = require("../entities/property-image.entity");
const amenity_entity_1 = require("../entities/amenity.entity");
const review_entity_1 = require("../entities/review.entity");
const property_rule_entity_1 = require("../entities/property-rule.entity");
const rule_category_entity_1 = require("../entities/rule-category.entity");
let PropertiesModule = class PropertiesModule {
};
exports.PropertiesModule = PropertiesModule;
exports.PropertiesModule = PropertiesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([property_entity_1.Property, property_image_entity_1.PropertyImage, amenity_entity_1.Amenity, review_entity_1.Review, property_rule_entity_1.PropertyRule, rule_category_entity_1.RuleCategory])],
        controllers: [properties_controller_1.PropertiesController],
        providers: [properties_service_1.PropertiesService],
        exports: [properties_service_1.PropertiesService],
    })
], PropertiesModule);
//# sourceMappingURL=properties.module.js.map