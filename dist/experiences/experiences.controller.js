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
exports.ExperiencesController = void 0;
const common_1 = require("@nestjs/common");
const experiences_service_1 = require("./experiences.service");
let ExperiencesController = class ExperiencesController {
    experiencesService;
    constructor(experiencesService) {
        this.experiencesService = experiencesService;
    }
    findAll() {
        return this.experiencesService.findAll();
    }
    search(location, startDate, endDate, monthsCount, flexibleType, flexibleMonths, adults, children) {
        return this.experiencesService.search({
            location,
            startDate,
            endDate,
            monthsCount: monthsCount ? parseInt(monthsCount, 10) : undefined,
            flexibleType,
            flexibleMonths: flexibleMonths ? flexibleMonths.split(',') : undefined,
            adults: adults ? parseInt(adults, 10) : undefined,
            children: children ? parseInt(children, 10) : undefined,
        });
    }
    findOne(id) {
        return this.experiencesService.findOne(id);
    }
};
exports.ExperiencesController = ExperiencesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ExperiencesController.prototype, "findAll", null);
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ExperiencesController.prototype, "search", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ExperiencesController.prototype, "findOne", null);
exports.ExperiencesController = ExperiencesController = __decorate([
    (0, common_1.Controller)('experiences'),
    __metadata("design:paramtypes", [experiences_service_1.ExperiencesService])
], ExperiencesController);
//# sourceMappingURL=experiences.controller.js.map