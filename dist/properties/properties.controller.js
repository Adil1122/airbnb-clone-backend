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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertiesController = void 0;
const common_1 = require("@nestjs/common");
const properties_service_1 = require("./properties.service");
let PropertiesController = class PropertiesController {
    propertiesService;
    constructor(propertiesService) {
        this.propertiesService = propertiesService;
    }
    findAll(categoryId) {
        const numericCategoryId = categoryId ? parseInt(categoryId, 10) : undefined;
        return this.propertiesService.findAll(numericCategoryId);
    }
    search(location, startDate, endDate, monthsCount, flexibleType, flexibleMonths, adults, children, infants, pets) {
        return this.propertiesService.search({
            location,
            startDate,
            endDate,
            monthsCount: monthsCount ? parseInt(monthsCount, 10) : undefined,
            flexibleType,
            flexibleMonths: flexibleMonths ? flexibleMonths.split(',') : undefined,
            adults: adults ? parseInt(adults, 10) : undefined,
            children: children ? parseInt(children, 10) : undefined,
            infants: infants ? parseInt(infants, 10) : undefined,
            pets: pets === 'true',
        });
    }
    findOne(id) {
        return this.propertiesService.findOne(id);
    }
    findAmenities(id) {
        return this.propertiesService.findAmenities(id);
    }
    findReviews(id) {
        return this.propertiesService.findReviews(id);
    }
};
exports.PropertiesController = PropertiesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PropertiesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('location')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Query)('monthsCount')),
    __param(4, (0, common_1.Query)('flexibleType')),
    __param(5, (0, common_1.Query)('flexibleMonths')),
    __param(6, (0, common_1.Query)('adults')),
    __param(7, (0, common_1.Query)('children')),
    __param(8, (0, common_1.Query)('infants')),
    __param(9, (0, common_1.Query)('pets')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], PropertiesController.prototype, "search", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PropertiesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/amenities'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PropertiesController.prototype, "findAmenities", null);
__decorate([
    (0, common_1.Get)(':id/reviews'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PropertiesController.prototype, "findReviews", null);
exports.PropertiesController = PropertiesController = __decorate([
    (0, common_1.Controller)('properties'),
    __metadata("design:paramtypes", [properties_service_1.PropertiesService])
], PropertiesController);
//# sourceMappingURL=properties.controller.js.map